"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Loader2, Sparkles, Bell, RefreshCw } from "lucide-react";

type AutoLog = {
  time: string;
  activity: string;
  cause: string;
  status: "Gagal" | "Berhasil";
};

export default function AutomationPage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [logs, setLogs] = useState<AutoLog[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);

    const { data: todayOrders } = await supabase
      .from("orders")
      .select("id, status, created_at, packages(title), profiles(full_name)")
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true });

    const total = todayOrders?.length ?? 0;
    const success = todayOrders?.filter(o => ["paid", "scheduled", "done"].includes(o.status)).length ?? 0;
    const failed = todayOrders?.filter(o => o.status === "cancelled").length ?? 0;

    setStats({ total, success, failed });

    setSummary(
      total > 0
        ? `Hari ini sistem menjalankan ${total} otomatisasi.\n${success} berhasil dan ${failed} gagal.\nAktivitas terbanyak: Notifikasi Jadwal Booking.\n${failed > 0 ? "Kegagalan terbanyak terjadi karena jadwal studio penuh." : "Semua aktivitas berjalan lancar."}`
        : "Belum ada aktivitas otomatisasi hari ini."
    );

    const logList: AutoLog[] = [];

    for (const o of todayOrders?.filter(o => o.status === "cancelled") ?? []) {
      logList.push({
        time: new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        activity: `Booking ${(o.packages as any)?.title ?? "-"}`,
        cause: "Pesanan dibatalkan",
        status: "Gagal",
      });
    }

    const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
    const { data: longPending } = await supabase
      .from("orders")
      .select("id, created_at, packages(title)")
      .eq("status", "pending")
      .lt("created_at", twoHoursAgo)
      .order("created_at", { ascending: true })
      .limit(10);

    for (const o of longPending ?? []) {
      logList.push({
        time: new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        activity: "Sinkronisasi Jadwal",
        cause: `Pending lama: ${(o.packages as any)?.title ?? "-"}`,
        status: "Gagal",
      });
    }

    for (const o of todayOrders?.filter(o => o.status === "scheduled").slice(0, 3) ?? []) {
      logList.push({
        time: new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        activity: `Konfirmasi ${(o.packages as any)?.title ?? "-"}`,
        cause: "Terjadwal otomatis",
        status: "Berhasil",
      });
    }

    setLogs(logList.sort((a, b) => a.time.localeCompare(b.time)));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateAI = async () => {
    setAiLoading(true);
    setAiAnalysis("");

    try {
      const { data: allOrders } = await supabase
        .from("orders")
        .select("id, status, created_at, total_price_idr, packages(title)")
        .order("created_at", { ascending: false })
        .limit(50);

      const prompt = `Kamu adalah analis sistem untuk PAMA Studio, sebuah studio foto di Indonesia.
Berikut adalah data pesanan terbaru (${allOrders?.length ?? 0} pesanan):

${allOrders?.map(o => `- ${(o.packages as any)?.title ?? "?"} | Status: ${o.status} | Tanggal: ${new Date(o.created_at).toLocaleDateString("id-ID")}`).join("\n")}

Berikan analisis singkat (3-4 kalimat) tentang:
1. Pola booking yang terlihat
2. Status yang paling sering muncul
3. Rekomendasi untuk meningkatkan konversi

Gunakan bahasa Indonesia yang profesional dan ringkas.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.content?.map((c: any) => c.text ?? "").join("") ?? "Gagal generate analisis.";
      setAiAnalysis(text);
    } catch {
      setAiAnalysis("Gagal menghubungi AI. Coba lagi.");
    }

    setAiLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-red-600" size={32} />
    </div>
  );

  const failedLogs = logs.filter(l => l.status === "Gagal");

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="bg-[#8B1A1A] rounded-2xl p-6 text-white">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/70">Summary AI Insights</p>
            <p className="text-sm text-white/80">Ringkasan Otomatisasi</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
        </div>

        {/* AI Generate */}
        <div className="bg-[#8B1A1A] rounded-2xl p-6 text-white flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/70">AI Generate Analysis</p>
            <p className="text-sm text-white/80">Analisis Otomatis (AI Analysis)</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 flex-1 min-h-[100px]">
            {aiLoading ? (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Loader2 size={16} className="animate-spin" /> Generating analisis...
              </div>
            ) : aiAnalysis ? (
              <p className="text-sm leading-relaxed">{aiAnalysis}</p>
            ) : (
              <p className="text-sm text-white/50">Klik tombol di bawah untuk generate analisis AI berdasarkan data booking.</p>
            )}
          </div>
          <button
            onClick={generateAI}
            disabled={aiLoading}
            className="mt-4 self-end flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#8B1A1A] text-xs font-black hover:bg-white/90 transition disabled:opacity-50"
          >
            <Sparkles size={14} />
            {aiLoading ? "Loading..." : "Generate Analisis"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#8B1A1A] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <p className="font-black uppercase tracking-widest text-sm">Notifications</p>
          </div>
          <button onClick={fetchData} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition">
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-sm text-white/70 mb-4">
          Terdapat {failedLogs.length} Aktivitas Automation yang Memerlukan Pengecekan.
        </p>

        {logs.length === 0 ? (
          <div className="bg-white/10 rounded-xl p-6 text-center text-white/50 text-sm">
            Tidak ada aktivitas hari ini
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 px-4 py-2 text-white/60 text-xs font-bold uppercase tracking-wide mb-2">
              <span>Waktu</span>
              <span>Aktivitas Automation</span>
              <span>Penyebab</span>
              <span>Status</span>
            </div>

            {/* Scrollable rows */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {logs.map((log, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 bg-white/10 hover:bg-white/20 transition rounded-xl px-4 py-4 items-center">
                  <span className="font-bold text-sm">{log.time}</span>
                  <span className="text-sm">{log.activity}</span>
                  <span className="text-sm text-white/80">{log.cause}</span>
                  <span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      log.status === "Gagal"
                        ? "bg-red-500/40 text-red-200"
                        : "bg-green-500/30 text-green-200"
                    }`}>
                      {log.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}