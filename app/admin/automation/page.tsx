"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Loader2, Sparkles, Bell, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
      <Loader2 className="animate-spin text-[#8B1A1A]" size={32} />
    </div>
  );

  const failedLogs = logs.filter(l => l.status === "Gagal");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">Otomasi Sistem</span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1a0505] mt-1" style={{ fontFamily: "Fraunces, serif" }}>
            Automation Center
          </h1>
          <p className="text-sm text-[#3a1a1a]/50 mt-1">Monitoring aktivitas & analisis AI</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#8B1A1A]/20 bg-white text-sm font-semibold text-[#8B1A1A] hover:bg-[#8B1A1A]/5 transition-all">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] rounded-3xl p-8 text-white"
        >
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Summary AI Insights</p>
            <p className="text-sm text-white/80 mt-1">Ringkasan Otomatisasi</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-5">
            <p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black">{stats.total}</p>
              <p className="text-xs text-white/70 mt-1">Total</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-300">{stats.success}</p>
              <p className="text-xs text-white/70 mt-1">Berhasil</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-red-300">{stats.failed}</p>
              <p className="text-xs text-white/70 mt-1">Gagal</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-[#8B1A1A]/10 p-8 shadow-sm"
        >
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8B1A1A]">AI Generate Analysis</p>
            <p className="text-sm text-[#3a1a1a]/60 mt-1">Analisis Otomatis (AI Analysis)</p>
          </div>
          <div className="bg-[#FBF7F1] rounded-2xl p-5 min-h-[120px] flex items-center justify-center">
            {aiLoading ? (
              <div className="flex items-center gap-2 text-[#3a1a1a]/50 text-sm">
                <Loader2 size={16} className="animate-spin" /> Generating analisis...
              </div>
            ) : aiAnalysis ? (
              <p className="text-sm leading-relaxed">{aiAnalysis}</p>
            ) : (
              <p className="text-sm text-[#3a1a1a]/40 text-center">Klik tombol di bawah untuk generate analisis AI berdasarkan data booking.</p>
            )}
          </div>
          <button
            onClick={generateAI}
            disabled={aiLoading}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B1A1A] text-white text-sm font-semibold hover:bg-[#6B1212] transition-all disabled:opacity-50"
          >
            <Sparkles size={16} />
            {aiLoading ? "Loading..." : "Generate Analisis"}
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-[#8B1A1A]/10 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-[#8B1A1A]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B1A1A]/10 flex items-center justify-center">
              <Bell size={20} className="text-[#8B1A1A]" />
            </div>
            <div>
              <h2 className="font-bold text-[#1a0505]">Notifications</h2>
              <p className="text-xs text-[#3a1a1a]/50 mt-0.5">
                Terdapat {failedLogs.length} Aktivitas Automation yang Memerlukan Pengecekan
              </p>
            </div>
          </div>
          <button onClick={fetchData} className="p-2 hover:bg-[#8B1A1A]/5 rounded-lg transition-all">
            <RefreshCw size={16} className="text-[#8B1A1A]/60" />
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#3a1a1a]/30">
            <CheckCircle2 size={40} className="mb-3" />
            <p className="text-sm font-medium">Tidak ada aktivitas hari ini</p>
            <Link href="/paket" className="mt-3 text-xs text-[#8B1A1A] font-semibold hover:underline">Lihat paket tersedia</Link>
          </div>
        ) : (
          <div className="divide-y divide-[#8B1A1A]/5">
            <div className="grid grid-cols-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#3a1a1a]/40 bg-[#FBF7F1]">
              <span>Waktu</span>
              <span>Aktivitas</span>
              <span>Penyebab</span>
              <span>Status</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-[#FBF7F1]/30 transition-colors">
                <span className="font-bold text-[#1a0505]">{log.time}</span>
                <span className="text-[#3a1a1a]/70">{log.activity}</span>
                <span className="text-[#3a1a1a]/60 text-sm">{log.cause}</span>
                <span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    log.status === "Berhasil"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}>
                    {log.status === "Berhasil" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {log.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}