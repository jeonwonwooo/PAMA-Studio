"use client";

import React, { useEffect, useState } from "react";
import { Bell, ShoppingBag, Clock, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

type Notif = {
  id: string;
  type: "new_order" | "long_pending";
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);

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
        fetchNotifs();
      } catch (error) {
        console.error("Admin check error:", error);
        router.push("/");
      }
    };

    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notifications");
        if (!res.ok) {
          console.error("Failed to fetch notifications");
          return;
        }
        const data = await res.json();
        setNotifs(data.notifications);
      } catch (error) {
        console.error("Fetch notifications error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter(n => !n.read).length;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FBF7F1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#8B1A1A]" />
          <p className="text-[#3a1a1a]/60 font-medium">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">Sistem Notifikasi</span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1a0505] mt-1 flex items-center gap-3" style={{ fontFamily: "Fraunces, serif" }}>
            Notifikasi
            {unreadCount > 0 && (
              <span className="text-sm bg-red-600 text-white px-2.5 py-1 rounded-full font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-[#3a1a1a]/50 mt-1">Update pesanan & aktivitas penting</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-[#8B1A1A] font-semibold hover:opacity-70 transition-all">
            <CheckCheck size={16} /> Tandai semua dibaca
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#8B1A1A]" size={32} />
        </div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#3a1a1a]/30">
          <Bell size={48} className="mb-4" />
          <p className="text-lg font-medium text-[#1a0505]">Tidak ada notifikasi</p>
          <p className="text-sm text-[#3a1a1a]/40 mt-1">Semua sudah dibaca</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifs.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-5 rounded-3xl border cursor-pointer transition-all
                ${n.read ? "bg-white border-[#8B1A1A]/10" : "bg-[#8B1A1A]/5 border-[#8B1A1A]/20 shadow-sm"}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                n.type === "new_order" ? "bg-blue-50 text-blue-500" : "bg-amber-50 text-amber-500"
              }`}>
                {n.type === "new_order" ? <ShoppingBag size={22} /> : <Clock size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-base font-bold ${n.read ? "text-[#3a1a1a]/70" : "text-[#1a0505]"}`}>{n.title}</p>
                  {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-sm text-[#3a1a1a]/60 mt-1 leading-relaxed">{n.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={12} className="text-[#3a1a1a]/30" />
                  <p className="text-xs text-[#3a1a1a]/40">{timeAgo(n.time)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}