"use client";

import { MessageCircle } from "lucide-react";

const WA_ADMIN = process.env.NEXT_PUBLIC_WA_ADMIN || "6282331555431";

export default function WhatsAppButton({ orderData }: { orderData: any }) {
  const handleWA = () => {
    const text = `Halo PAMA Studio! Saya ingin konfirmasi pembayaran:\n\n*Order ID:* #${orderData.id.slice(0, 8)}\n*Paket:* ${orderData.packages?.title}\n*Total:* Rp ${new Intl.NumberFormat("id-ID").format(orderData.total_price_idr)}\n\nMohon instruksi selanjutnya.`;
    window.open(`https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <button 
      onClick={handleWA}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#1da851] active:scale-95"
    >
      <MessageCircle className="h-5 w-5" />
      Kirim Struk ke WhatsApp Admin
    </button>
  );
}
