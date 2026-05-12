"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Bell, ShoppingBag, Clock, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-red-600 text-sm font-semibold">Sistem Notifikasi</p>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Notifikasi
            {unreadCount > 0 && (
              <span className="text-sm bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-red-600 font-semibold hover:underline">
            <CheckCheck size={16} /> Tandai semua dibaca
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Bell size={40} className="mb-3" />
          <p className="font-medium">Tidak ada notifikasi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all
                ${n.read ? "bg-white border-gray-100" : "bg-red-50/50 border-red-100 shadow-sm"}`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                ${n.type === "new_order" ? "bg-blue-50 text-blue-500" : "bg-amber-50 text-amber-500"}`}>
                {n.type === "new_order" ? <ShoppingBag size={20} /> : <Clock size={20} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold ${n.read ? "text-gray-700" : "text-gray-900"}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.time)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}