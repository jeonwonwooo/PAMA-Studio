"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  RefreshCw, Download, ShoppingBag, Clock, ChevronDown, Check, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
  paid: "bg-green-100 text-green-700",
  done: "bg-gray-100 text-gray-600",
  in_progress: "bg-cyan-100 text-cyan-700",
  awaiting_payment: "bg-orange-100 text-orange-700",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  scheduled: "bg-blue-500",
  cancelled: "bg-red-500",
  paid: "bg-green-500",
  done: "bg-gray-400",
  in_progress: "bg-cyan-500",
  awaiting_payment: "bg-orange-400",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  awaiting_payment: "Menunggu Bayar",
  paid: "Dibayar",
  scheduled: "Terkonfirmasi",
  in_progress: "Berlangsung",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Konfirmasi" },
  { value: "cancelled", label: "Batalkan" },
];

function StatusDropdown({ orderId, current, onUpdate }: {
  orderId: string;
  current: string;
  onUpdate: (id: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(v => !v);
  };

  const handleSelect = async (status: string) => {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/operational", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        onUpdate(orderId, status);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${STATUS_COLOR[current] ?? "bg-gray-100 text-gray-500"}`}
      >
        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[current] ?? "bg-gray-400"}`} />
        {loading ? <Loader2 size={12} className="animate-spin" /> : STATUS_LABEL[current] ?? current}
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
            style={{ top: pos.top, left: pos.left }}
          >
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition
                  ${current === opt.value ? "text-red-600" : "text-gray-700"}`}
              >
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[opt.value] ?? "bg-gray-400"}`} />
                {opt.label}
                {current === opt.value && <Check size={12} className="ml-auto text-red-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OperationalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [todayOrders, setTodayOrders] = useState<any[]>([]);
  const [weekStats, setWeekStats] = useState({ thisWeek: 0, lastWeek: 0 });
  const [pendingCount, setPendingCount] = useState(0);
  const [longestPending, setLongestPending] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/operational");
      if (!res.ok) {
        console.error("Failed to fetch operational data");
        return;
      }
      const data = await res.json();

      setOrders(data.orders);

      const today = new Date().toISOString().slice(0, 10);
      const todayData = data.orders.filter((o: any) =>
        o.scheduled_at?.startsWith(today)
      );
      setTodayOrders(todayData);

      // Calculate week stats (simplified)
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const thisWeekOrders = data.orders.filter((o: any) =>
        new Date(o.created_at) >= weekAgo
      ).length;

      const lastWeekOrders = data.orders.filter((o: any) =>
        new Date(o.created_at) >= twoWeeksAgo && new Date(o.created_at) < weekAgo
      ).length;

      setWeekStats({ thisWeek: thisWeekOrders, lastWeek: lastWeekOrders });

      const pendingOrders = data.orders.filter((o: any) => o.status === "pending");
      setPendingCount(pendingOrders.length);
      if (pendingOrders.length > 0) {
        setLongestPending(pendingOrders[0].created_at);
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        if (data.profile?.role !== "admin") {
          router.push("/");
          return;
        }
        setIsAdmin(true);
        fetchData();
      } catch (error) {
        console.error("Admin check error:", error);
        router.push("/");
      }
    };

    checkAdmin();
  }, [router]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/operational", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        setTodayOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        if (status !== "pending") setPendingCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const pct = weekStats.lastWeek > 0
    ? Math.round(((weekStats.thisWeek - weekStats.lastWeek) / weekStats.lastWeek) * 100)
    : weekStats.thisWeek > 0 ? 100 : 0;

  const todayStr = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const todayBooking = orders.filter(o => o.created_at?.startsWith(new Date().toISOString().slice(0, 10))).length;
  const inProgressCount = orders.filter(o => o.status === "in_progress").length;

  const exportCSV = () => {
    const rows = [["ID", "Customer", "Paket", "Status", "Jadwal", "Total"]];
    orders.forEach(o => {
      rows.push([
        o.id.slice(0, 8),
        o.profiles?.full_name ?? "-",
        o.packages?.title ?? "-",
        STATUS_LABEL[o.status] ?? o.status,
        o.scheduled_at ? new Date(o.scheduled_at).toLocaleString("id-ID") : "-",
        o.total_price_idr,
      ]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "orders.csv";
    a.click();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-red-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-red-600 text-sm font-semibold">Sistem Operasional</p>
          <h1 className="text-2xl font-bold text-gray-800">Operational Health</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <RefreshCw size={15} /> Refresh Data
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B1A1A] text-white text-sm font-semibold hover:bg-[#6B1212] transition">
            <Download size={15} /> Export Data
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Total Booking Minggu Ini</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-black text-gray-800">{pct >= 0 ? "+" : ""}{pct}%</span>
            <span className="text-xs text-gray-400">Dari Minggu Lalu</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Minggu Lalu</span>
              <span className="text-red-500 font-semibold">{weekStats.lastWeek} booking</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min((weekStats.lastWeek / Math.max(weekStats.thisWeek, weekStats.lastWeek, 1)) * 100, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Minggu Ini</span>
              <span className="text-red-500 font-semibold">{weekStats.thisWeek} booking</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min((weekStats.thisWeek / Math.max(weekStats.thisWeek, weekStats.lastWeek, 1)) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Today Booking */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booking Hari Ini</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <ShoppingBag size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-800">{todayBooking} <span className="text-base font-semibold text-gray-500">Booking</span></p>
              <p className="text-xs text-gray-400">{inProgressCount} booking berlangsung</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booking Pending</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={22} className="text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-black text-gray-800">{pendingCount} <span className="text-base font-semibold text-gray-500">Pending</span></p>
              {longestPending && <p className="text-xs text-gray-400">Terlama: {timeAgo(longestPending)}</p>}
            </div>
          </div>
          {pendingCount > 0 && (
            <button className="mt-3 self-end px-3 py-1.5 rounded-lg bg-[#8B1A1A] text-white text-xs font-bold hover:bg-[#6B1212] transition">
              Review Pending
            </button>
          )}
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">Jadwal Hari Ini</h2>
          <p className="text-sm text-gray-400">{todayStr}</p>
        </div>
        {todayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Clock size={28} className="mb-2" />
            <p className="text-sm">Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Sesi</th>
                <th className="px-6 py-3 text-left">Paket</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {order.scheduled_at ? formatTime(order.scheduled_at) : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{(order.packages as any)?.title ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{(order.profiles as any)?.full_name ?? "-"}</td>
                  <td className="px-6 py-4">
                    <StatusDropdown orderId={order.id} current={order.status} onUpdate={handleStatusUpdate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Aktivitas Terbaru</h2>
            <p className="text-xs text-gray-400">Update booking terbaru</p>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Paket</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {((order.profiles as any)?.full_name ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{(order.profiles as any)?.full_name ?? "-"}</p>
                      <p className="text-xs text-gray-400">{(order.profiles as any)?.email ?? ""}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{(order.packages as any)?.title ?? "-"}</td>
                <td className="px-6 py-4">
                  <StatusDropdown orderId={order.id} current={order.status} onUpdate={handleStatusUpdate} />
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">{timeAgo(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}