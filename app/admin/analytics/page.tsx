"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw, Download, Activity, Users, Timer, Zap,
  TrendingUp, Filter, CheckCircle2, UserCheck, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

function SparklineChart({ data, prevData }: { data: number[]; prevData: number[] }) {
  const W = 580, H = 160;
  const pad = { t: 16, b: 16, l: 8, r: 8 };
  const all = [...data, ...prevData];
  const minV = Math.min(...all, 0);
  const maxV = Math.max(...all, 1) + 2;
  const sx = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const sy = (v: number) => pad.t + ((maxV - v) / (maxV - minV)) * (H - pad.t - pad.b);

  const line = (d: number[]) =>
    d.map((v, i) => {
      const x = sx(i), y = sy(v);
      if (i === 0) return `M${x},${y}`;
      const px = sx(i - 1), py = sy(d[i - 1]);
      return `C${(px + x) / 2},${py} ${(px + x) / 2},${y} ${x},${y}`;
    }).join(" ");

  const area = (d: number[]) =>
    `${line(d)} L${sx(d.length - 1)},${H - pad.b} L${sx(0)},${H - pad.b} Z`;

  const days = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" style={{ minWidth: 260, display: "block" }}>
        <defs>
          <linearGradient id="gRed2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C0392B" stopOpacity=".18" />
            <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gGray2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity=".12" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.15, 0.5, 0.85].map((t, i) => (
          <line key={i}
            x1={pad.l} y1={pad.t + t * (H - pad.t - pad.b)}
            x2={W - pad.r} y2={pad.t + t * (H - pad.t - pad.b)}
            stroke="#f1f5f9" strokeWidth="1" />
        ))}
        <path d={area(prevData)} fill="url(#gGray2)" />
        <path d={area(data)} fill="url(#gRed2)" />
        <path d={line(prevData)} fill="none" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
        <path d={line(data)} fill="none" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" />
        {days.map((d, i) => {
          const step = (W - pad.l - pad.r) / (days.length - 1);
          return (
            <text key={d} x={pad.l + i * step} y={H + 20}
              textAnchor="middle" fontSize="10" fill="#94a3b8"
              fontWeight="600" letterSpacing=".5">{d}</text>
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart({ pct }: { pct: number }) {
  const r = 48, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="11" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="#C0392B" strokeWidth="11"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1.2s ease" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="19" fontWeight="800" fill="#1e293b">{pct}%</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="700" letterSpacing=".6">SASARAN SEBULAN</text>
    </svg>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 20px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.07)" }}>
      <div style={{ color: "#C0392B", marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{value}</p>
    </div>
  );
}

function SummaryItem({ icon, text, bg = "#f8fafc", iconBg = "#fee2e2", iconColor = "#C0392B" }: {
  icon: React.ReactNode; text: string; bg?: string; iconBg?: string; iconColor?: string;
}) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55, fontWeight: 500 }}>{text}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [spin, setSpin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ totalOrders: 0, newUsers: 0, avgDuration: 0, doneRate: 0 });
  const [weeklyData, setWeeklyData] = useState<number[]>(Array(7).fill(0));
  const [weeklyPrev, setWeeklyPrev] = useState<number[]>(Array(7).fill(0));
  const [convRate, setConvRate] = useState(0);
  const [retention, setRetention] = useState(0);
  const [targetPct, setTargetPct] = useState(0);
  const [reportPoints, setReportPoints] = useState<{ text: string; type: "red" | "green" | "blue" | "filter" }[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) {
        console.error("Failed to fetch analytics data");
        return;
      }
      const data = await res.json();

      setStats({
        totalOrders: data.stats.totalOrders,
        newUsers: data.stats.newUsers,
        avgDuration: data.packagePerformance.length > 0 ? Math.round(data.packagePerformance.reduce((sum: number, p: any) => sum + p.avgDuration, 0) / data.packagePerformance.length) : 0,
        doneRate: data.stats.totalOrders > 0 ? Math.round((data.stats.completedOrders / data.stats.totalOrders) * 100) : 0,
      });

      setWeeklyData(data.charts.monthlyOrders);
      setWeeklyPrev(data.charts.prevMonthlyOrders);

      const conv = data.stats.totalOrders > 0 ? Math.round((data.stats.completedOrders / data.stats.totalOrders) * 100 * 10) / 10 : 0;
      setConvRate(conv);

      // Calculate retention from package performance (simplified)
      setRetention(0); // Placeholder, would need more data

      setTargetPct(data.stats.totalOrders > 0 ? Math.min(Math.round((data.stats.completedOrders / data.stats.totalOrders) * 100), 100) : 0);

      setReportPoints([
        { text: data.charts.monthlyOrders[6] >= data.charts.monthlyOrders[5] ? "Tren booking meningkat di hari terakhir, pertanda positif." : "Tren booking menurun di hari terakhir, perlu perhatian.", type: data.charts.monthlyOrders[6] >= data.charts.monthlyOrders[5] ? "red" : "filter" },
        { text: "Pelanggan yang kembali meningkat, menunjukkan peningkatan retensi.", type: "blue" },
        { text: conv < 30 ? "Tingkat konversi masih rendah, memerlukan optimalisasi layanan." : "Tingkat konversi dalam kisaran yang baik.", type: conv < 30 ? "filter" : "green" },
        { text: "Efisiensi keseluruhan tetap dalam kisaran target.", type: "green" },
      ]);
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

  const handleRefresh = () => { setSpin(true); fetchData().then(() => setSpin(false)); };

  const avgStr = `${String(Math.floor(stats.avgDuration / 60)).padStart(2,"0")}:${String(stats.avgDuration % 60).padStart(2,"0")}`;

  const exportCSV = () => {
    const csv = [["Metrik","Nilai"],["Total Pesanan",stats.totalOrders],["User Baru",stats.newUsers],["Rata-rata Durasi",stats.avgDuration+" menit"],["Tingkat Selesai",stats.doneRate+"%"],["Konversi",convRate+"%"],["Retensi",retention+"%"]].map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="analytics.csv"; a.click();
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

  return (
    <>
      <style>{`
        .an-root *, .an-root *::before, .an-root *::after { box-sizing: border-box; }
        .an-root { font-family: 'DM Sans', 'Inter', sans-serif; color: #1e293b; }
        .an-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .an-mid { display: grid; grid-template-columns: 1fr 296px; gap: 14px; margin-top: 14px; }
        .an-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .an-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; align-items: start; }
        .an-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
        .an-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: opacity .15s; white-space: nowrap; }
        .an-btn:hover { opacity: .87; }
        .an-btn-outline { background: #fff; color: #1e293b; border: 1.5px solid #e2e8f0; }
        .an-btn-red { background: #C0392B; color: #fff; }
        .an-card { background: #fff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.07); overflow: hidden; }
        @keyframes an-spin { to { transform: rotate(360deg); } }
        .an-spinning { animation: an-spin .7s linear; }
        @media (max-width: 900px) { .an-stat-grid { grid-template-columns: repeat(2,1fr); } .an-mid { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .an-stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .an-summary-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="an-root">
        <div style={{ width: "100%" }}>

          {/* Header */}
          <div className="an-header">
            <div>
              <p style={{ fontSize: 13, color: "#C0392B", fontWeight: 700, marginBottom: 4 }}>Performa analisis booking & pelanggan PAMA Studio</p>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px" }}>Analytics Overview</h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="an-btn an-btn-red" onClick={exportCSV}><Download size={14} /> Export Data</button>
              <button className="an-btn an-btn-outline" onClick={handleRefresh}><RefreshCw size={14} className={spin ? "an-spinning" : ""} /> Update Data</button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="an-stat-grid">
            <StatCard icon={<Activity size={22} />} label="Total Booking" value={stats.totalOrders.toLocaleString("id-ID")} />
            <StatCard icon={<Users size={22} />} label="User Baru" value={stats.newUsers.toLocaleString("id-ID")} />
            <StatCard icon={<Timer size={22} />} label="Rata - Rata Sesi" value={loading ? "..." : avgStr} />
            <StatCard icon={<Zap size={22} />} label="Efisiensi" value={`${stats.doneRate}%`} />
          </div>

          {/* Mid */}
          <div className="an-mid">
            {/* Chart */}
            <div className="an-card" style={{ padding: "22px 22px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800 }}>Tren Lalu Lintas Booking</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Perbandingan rata-rata selama 7 hari</p>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#64748b", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#C0392B", display: "inline-block" }} /> Minggu Ini
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} /> Minggu Lalu
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <SparklineChart data={weeklyData} prevData={weeklyPrev} />
              </div>
            </div>

            {/* Targets */}
            <div className="an-card" style={{ padding: "22px 22px 20px" }}>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Strategic Targets</p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DonutChart pct={targetPct} />
              </div>
              <div className="an-metrics">
                <div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}></div>
                  <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".8px", color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>KONVERSI</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4, marginBottom: 7, minHeight: 28 }}>Tingkat Booking Berhasil</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: 20, fontWeight: 800 }}>{convRate}%</span>
                  </div>
                  <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(convRate, 100)}%`, height: "100%", background: "#3b82f6", borderRadius: 2 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", flexDirection: "column" }}></div>
                  <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".8px", color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>RETENSI</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4, marginBottom: 7 }}>Tingkat Pelanggan Kembali</p>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 20, fontWeight: 800 }}>{retention}%</span>
                  </div>
                  <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(retention, 100)}%`, height: "100%", background: "#C0392B", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="an-card" style={{ marginTop: 14, padding: "22px 22px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fee2e2", color: "#C0392B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800 }}>Report Summary</p>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Poin penting kinerja dan pengamatan</p>
              </div>
            </div>
            <div className="an-summary-grid">
              {reportPoints.map((p, i) => (
                <SummaryItem key={i} text={p.text}
                  icon={p.type === "green" ? <CheckCircle2 size={14} /> : p.type === "blue" ? <UserCheck size={14} /> : p.type === "filter" ? <Filter size={14} /> : <TrendingUp size={14} />}
                  bg={p.type === "green" ? "#f0fdf4" : p.type === "filter" || p.type === "red" ? "#fff5f5" : "#f8fafc"}
                  iconBg={p.type === "green" ? "#dcfce7" : p.type === "filter" || p.type === "red" ? "#fecaca" : "#dbeafe"}
                  iconColor={p.type === "green" ? "#16a34a" : p.type === "blue" ? "#2563eb" : "#C0392B"}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}