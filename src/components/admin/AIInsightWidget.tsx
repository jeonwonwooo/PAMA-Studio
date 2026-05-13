"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Zap, 
  PieChart, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIInsight {
  executive_summary: string;
  performance_analysis: string;
  package_insights: string;
  recommendations: string[];
}

function InsightSection({ title, icon, content, color, recommendations }: { 
  title: string; 
  icon: React.ReactNode; 
  content?: string; 
  color: "blue" | "violet" | "emerald" | "amber";
  recommendations?: string[];
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800",
    violet: "from-violet-500/10 to-violet-600/5 border-violet-200 dark:border-violet-800",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800",
  };
  
  const iconColor = {
    blue: "text-blue-600 dark:text-blue-400",
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  const bulletColor = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-3xl p-6 border shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl shadow-sm">
          <span className={iconColor[color]}>{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      
      {recommendations ? (
        <ul className="space-y-4">
          {recommendations.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-zinc-700 dark:text-zinc-300">
              <div className={`mt-1.5 w-5 h-5 rounded-full ${bulletColor[color]} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                {i + 1}
              </div>
              <span className="text-sm leading-relaxed font-medium">
                {item.split(/(\*\*.*?\*\*)/).map((part, index) => 
                  part.startsWith("**") && part.endsWith("**") 
                    ? <strong key={index} className="text-zinc-900 dark:text-zinc-100 font-black">{part.slice(2, -2)}</strong>
                    : part
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
          {content?.split(/(\*\*.*?\*\*)/).map((part, index) => 
            part.startsWith("**") && part.endsWith("**") 
              ? <strong key={index} className="text-zinc-900 dark:text-zinc-100 font-black">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      )}
    </motion.div>
  );
}

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  popularPackages: { title: string; count: number }[];
  dateRange: { start: string; end: string };
}

export default function AIInsightWidget() {
  const [range, setRange] = useState<Range>("daily");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stats: StatsData; insight: AIInsight } | null>(null);
  const [usage, setUsage] = useState<Record<Range, number>>({ daily: 0, weekly: 0, monthly: 0 });

  // Load usage from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("pama_ai_usage");
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("pama_ai_usage_date");

    if (lastDate !== today) {
      localStorage.setItem("pama_ai_usage_date", today);
      localStorage.setItem("pama_ai_usage", JSON.stringify({ daily: 0, weekly: 0, monthly: 0 }));
    } else if (stored) {
      setUsage(JSON.parse(stored));
    }
  }, []);

  const generateInsight = async () => {
    if (usage[range] >= 3) {
      alert(`Batas harian tercapai! Anda hanya dapat generate insight ${range} maksimal 3 kali sehari.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ range }),
      });
      const data = await response.json();
      if (data.success) {
        setResult({ stats: data.data, insight: data.insight });
        
        // Update usage
        const newUsage = { ...usage, [range]: usage[range] + 1 };
        setUsage(newUsage);
        localStorage.setItem("pama_ai_usage", JSON.stringify(newUsage));
      } else {
        alert(data.error || "Gagal mengambil insight");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/20 dark:shadow-none">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Powered by Llama 3.1</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Business <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Intelligence</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 max-w-md">
            Analisis data studio Anda secara instan untuk mendapatkan strategi pertumbuhan yang tepat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
            {(["daily", "weekly", "monthly"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  range === r
                    ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {r === "daily" ? "Harian" : r === "weekly" ? "Mingguan" : "Bulanan"}
                {usage[r] > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-400 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-800">
                    {usage[r]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={generateInsight}
              disabled={loading || usage[range] >= 3}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-900/10 dark:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-blue-400" />
              )}
              {loading ? "Analyst is thinking..." : usage[range] >= 3 ? "Batas Tercapai" : "Generate Insights"}
            </button>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
              Sisa hari ini: {3 - usage[range]}x generate
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Revenue" 
                value={`Rp ${result.stats.totalRevenue.toLocaleString("id-ID")}`} 
                icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                color="emerald"
                trend="Total pendapatan periode ini"
              />
              <StatCard 
                title="Orders" 
                value={result.stats.totalOrders} 
                icon={<ShoppingBag className="w-5 h-5 text-blue-500" />}
                color="blue"
                trend="Volume pesanan masuk"
              />
              <StatCard 
                title="Completed" 
                value={result.stats.completedOrders} 
                icon={<CheckCircle className="w-5 h-5 text-violet-500" />}
                color="violet"
                trend="Pesanan sukses dikerjakan"
              />
              <StatCard 
                title="Active" 
                value={result.stats.pendingOrders} 
                icon={<Clock className="w-5 h-5 text-amber-500" />}
                color="amber"
                trend="Pesanan dalam antrean"
              />
            </div>

            {/* AI Insight Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Analysis Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InsightSection 
                    title="Executive Summary" 
                    icon={<Zap className="w-5 h-5" />}
                    content={result.insight.executive_summary}
                    color="blue"
                  />
                  <InsightSection 
                    title="Performance" 
                    icon={<TrendingUp className="w-5 h-5" />}
                    content={result.insight.performance_analysis}
                    color="violet"
                  />
                </div>
                
                <InsightSection 
                  title="Strategic Recommendations" 
                  icon={<Sparkles className="w-5 h-5" />}
                  recommendations={result.insight.recommendations}
                  color="amber"
                />
              </div>

              {/* Sidebar: Package & Insight */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                      <PieChart className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold">Package Stats</h3>
                  </div>

                  <div className="space-y-6">
                    {result.stats.popularPackages.map((pkg, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{pkg.title}</span>
                          <span className="text-xs font-black text-zinc-400">{pkg.count} orders</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(pkg.count / Math.max(...result.stats.popularPackages.map(p => p.count))) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">AI Contextual Insight</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                        "{result.insight.package_insights}"
                      </p>
                    </div>

                    {result.stats.popularPackages.length === 0 && (
                      <p className="text-sm text-zinc-500 italic text-center py-4">Belum ada data paket.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-zinc-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-700">
                <Sparkles className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Ready to analyze?</h3>
            <p className="text-zinc-500 text-center max-w-xs mt-3 font-medium">
              Dapatkan analisis mendalam dan strategi bisnis berdasarkan performa studio Anda.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
type Range = "daily" | "weekly" | "monthly";

function StatCard({ title, value, icon, color, trend }: { title: string, value: string | number, icon: React.ReactNode, color: string, trend: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600",
    blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-600",
    violet: "bg-violet-50 dark:bg-violet-950/20 text-violet-600",
    amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-600",
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          {value}
        </div>
        <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          {trend}
        </p>
      </div>
    </div>
  );
}
