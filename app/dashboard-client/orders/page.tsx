"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag, Search, Filter, Calendar, ChevronRight, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my-orders");
        if (!res.ok) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Orders page fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.packages?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: "Inter Tight, sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">Riwayat Pesanan</span>
          <h1 className="text-3xl font-serif text-[#1a0505] mt-1" style={{ fontFamily: "Fraunces, serif" }}>
            Pesanan <span className="italic text-[#8B1A1A]">Saya</span>
          </h1>
          <p className="text-sm text-[#3a1a1a]/50 mt-1">Daftar lengkap riwayat pemotretan Anda</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a1a1a]/30" size={16} />
            <input
              type="text"
              placeholder="Cari ID Pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-[#8B1A1A]/10 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-[#8B1A1A]/10 rounded-full text-[#8B1A1A] hover:bg-[#8B1A1A]/5">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/50 rounded-[32px] animate-pulse" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center border border-[#8B1A1A]/10">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#8B1A1A]/20 mb-4" />
            <p className="text-[#3a1a1a]/60 font-medium mb-2">
              {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada pesanan"}
            </p>
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")} className="text-[#8B1A1A] text-sm font-semibold hover:underline">
                Clear search
              </button>
            ) : (
              <Link href="/paket" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#8B1A1A] text-white text-sm font-semibold rounded-full hover:bg-[#6B1212] transition-all">
                <Plus size={16} /> Pesan Paket
              </Link>
            )}
          </div>
        ) : (
          filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white p-6 rounded-[32px] border border-[#8B1A1A]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-[#8B1A1A]/20 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#FBF7F1] flex items-center justify-center text-[#8B1A1A] border border-[#8B1A1A]/5">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1A1A] bg-[#8B1A1A]/5 px-2 py-0.5 rounded">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      order.status === 'completed' || order.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1a0505]">{order.packages?.title || "Paket"}</h3>
                  <p className="text-xs text-[#3a1a1a]/50 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-none">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#3a1a1a]/40 uppercase tracking-widest">Total</p>
                  <p className="text-lg font-bold text-[#1a0505]">Rp {new Intl.NumberFormat("id-ID").format(order.total_price_idr)}</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-[#8B1A1A]/10 flex items-center justify-center text-[#8B1A1A] group-hover:bg-[#8B1A1A] group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}