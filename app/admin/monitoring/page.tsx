"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Globe, Database, Zap, Server, Users, Clock, AlertTriangle,
  CheckCircle, XCircle, HardDrive, CreditCard, Mail, Cloud,
  MessageSquare, Activity, RefreshCw, Download, Wifi, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

function timeNow() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatBytes(bytes: number) {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(1) + " TB";
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return bytes + " B";
}

type LogEntry = { time: string; message: string; type: "info" | "warn" | "error" | "success" };
type StatusItem = { label: string; status: "Online" | "Connected" | "Active" | "Stable" | "Error" | "Offline"; icon: React.ReactNode };

export default function MonitoringPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  // System Status
  const [systemStatus, setSystemStatus] = useState<StatusItem[]>([]);

  // Live Activity
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);

  // Error Logs
  const [errorLogs, setErrorLogs] = useState<LogEntry[]>([]);

  // Performance
  const [perf, setPerf] = useState({
    usersOnline: 0,
    responseTime: "—",
    requestsToday: 0,
    cpuUsage: 0,
  });

  // Storage
  const [storage, setStorage] = useState({
    used: 0,
    total: 12 * 1e12,
    lastBackup: "—",
  });

  // API Status
  const [apiStatus, setApiStatus] = useState<StatusItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setLastUpdate(timeNow());
    try {
      const res = await fetch("/api/admin/monitoring");
      if (!res.ok) {
        console.error("Failed to fetch monitoring data");
        return;
      }
      const data = await res.json();

      setSystemStatus(data.systemStatus.map((item: any) => ({
        ...item,
        icon: getIcon(item.icon),
      })));
      setPerf(data.performance);
      setStorage(data.storage);
      setActivityLogs(data.activityLogs);
      setErrorLogs(data.errorLogs);
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

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Database: <Database size={18} />,
      Server: <Server size={18} />,
      Users: <Users size={18} />,
      Mail: <Mail size={18} />,
      CreditCard: <CreditCard size={18} />,
      HardDrive: <HardDrive size={18} />,
    };
    return icons[iconName] || <Globe size={18} />;
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

  // Auto refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = (s: string) => {
    if (["Online", "Connected", "Active", "Stable"].includes(s)) return "text-green-400";
    if (s === "Error" || s === "Offline") return "text-red-400";
    return "text-yellow-400";
  };

  const statusBg = (s: string) => {
    if (["Online", "Connected", "Active", "Stable"].includes(s)) return "bg-green-500";
    if (s === "Error" || s === "Offline") return "bg-red-500";
    return "bg-yellow-500";
  };

  const logColor = (type: string) => {
    if (type === "error") return "text-red-400";
    if (type === "warn") return "text-yellow-400";
    if (type === "success") return "text-green-400";
    return "text-blue-300";
  };

  const logLabel = (type: string) => {
    if (type === "error") return "ERR!";
    if (type === "warn") return "WARN";
    if (type === "success") return "INFO";
    return "INFO";
  };

  const storagePercent = Math.min((storage.used / storage.total) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-600">System Monitoring</p>
          <h1 className="text-2xl font-bold text-gray-800">Node Integrity & Health</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Update
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <span className="text-xs text-gray-400">Update: {lastUpdate}</span>
        </div>
      </div>

      {/* Row 1: System Status + Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-red-600" /> System Status
          </h2>
          <div className="space-y-3">
            {systemStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="text-gray-400">{item.icon}</div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusBg(item.status)}`} />
                  <span className={`text-xs font-bold ${statusColor(item.status)}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Wifi size={18} className="text-red-600" /> Website Performance
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Users Online", value: perf.usersOnline, icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
              { label: "Response Time", value: perf.responseTime, icon: <Clock size={20} />, color: "bg-green-50 text-green-600" },
              { label: "Requests Today", value: perf.requestsToday, icon: <Activity size={20} />, color: "bg-purple-50 text-purple-600" },
              { label: "CPU Usage", value: `${perf.cpuUsage}%`, icon: <Server size={20} />, color: "bg-orange-50 text-orange-600" },
            ].map((card, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                  {card.icon}
                </div>
                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                <p className="text-xl font-black text-gray-800">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Live Activity + Error Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Activity — terminal style */}
        <div className="bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-400 font-mono">admin@pamastudio: ~/monitoring/live</span>
          </div>
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gray-500 flex-shrink-0">{log.time}</span>
                <span className={`flex-shrink-0 font-bold ${logColor(log.type)}`}>{logLabel(log.type)}</span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">Live System Activity</span>
            <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition">
              <Download size={12} /> Export Raw
            </button>
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-bold text-gray-800">Error & Failed Logs</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
            {errorLogs.map((log, i) => (
              <div key={i} className={`flex items-start gap-3 px-6 py-3 ${log.type === "error" ? "bg-red-50/50" : log.type === "warn" ? "bg-yellow-50/50" : "bg-green-50/50"}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {log.type === "error" ? <XCircle size={14} className="text-red-500" /> :
                    log.type === "warn" ? <AlertTriangle size={14} className="text-yellow-500" /> :
                      <CheckCircle size={14} className="text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{log.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Storage + API Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HardDrive size={18} className="text-red-600" /> Storage Usage
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Storage Terpakai</span>
                <span className="font-bold text-gray-800">{formatBytes(storage.used)} / {formatBytes(storage.total)}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${storagePercent > 80 ? "bg-red-500" : storagePercent > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.max(storagePercent, 0.5)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{storagePercent.toFixed(2)}% terpakai</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Sisa Storage</p>
                <p className="text-lg font-black text-gray-800">{formatBytes(storage.total - storage.used)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Backup Terakhir</p>
                <p className="text-sm font-bold text-gray-800">{storage.lastBackup}</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-red-600" /> API & Payment Status
          </h2>
          <div className="space-y-3">
            {apiStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="text-gray-400">{item.icon}</div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusBg(item.status)} animate-pulse`} />
                  <span className={`text-xs font-bold ${statusColor(item.status)}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}