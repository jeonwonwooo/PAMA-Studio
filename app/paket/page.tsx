"use client";

import React from "react";
import Link from "next/link";
import { Camera, Sparkles, Users, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PackageCard, { PackageData } from "@/components/paket/PackageCard";
import { useInView } from "@/hooks/useInView";

/* ── Data Paket Tetap Sama ── */
const packages: PackageData[] = [
  // ... (Data array packages kamu biarkan sama persis seperti aslinya)
  {
    id: "studio-1",
    title: "Studio 1",
    subtitle: "Self Photo Studio",
    description: "Studio self-photo dengan pencahayaan profesional dan kamera beresolusi tinggi. Cocok untuk foto solo, couple, maupun keluarga kecil. Kamu bebas berekspresi, kami pastikan hasilnya maksimal.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop",
    galleryImages: ["/images/foto1.jpg", "/images/foto2.jpg", "/images/foto3.jpg", "/images/foto4.jpg", "/images/foto5.jpg", "/images/foto6.jpg"],
    subPackages: [
      { name: "Duo", description: "Paket untuk 2 orang, 30 menit sesi, 15 foto edit", price: "Rp 299K" },
      { name: "Basic", description: "Paket 1 orang, 20 menit sesi, 10 foto edit", price: "Rp 199K" },
      { name: "Family", description: "Paket keluarga max 5 orang, 45 menit, 25 foto edit", price: "Rp 499K" },
      { name: "Group", description: "Paket group max 8 orang, 60 menit, 35 foto edit", price: "Rp 699K" },
    ],
    additionals: [
      { name: "Extra 10 foto edit", price: "+Rp 50K" },
      { name: "Cetak foto 4R (5 lembar)", price: "+Rp 35K" },
      { name: "Soft file semua foto", price: "+Rp 100K" },
      { name: "Extra 15 menit sesi", price: "+Rp 75K" },
    ],
    ctaLabel: "Lengkapi Data",
    ctaLink: "#kontak",
    accent: "maroon",
  },
  {
    id: "studio-2",
    title: "Studio 2",
    subtitle: "Premium Studio",
    description: "Studio dengan setup premium — backdrop yang lebih variatif, props eksklusif, dan area yang lebih luas. Ideal untuk sesi foto grup, konten kreator, atau momen spesial.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    galleryImages: ["/images/foto7.jpg", "/images/foto8.jpg", "/images/foto9.jpg", "/images/foto10.jpg"],
    subPackages: [
      { name: "Couple", description: "Paket couple romantis, 30 menit, 20 foto edit", price: "Rp 349K" },
      { name: "Squad", description: "Paket grup max 6 orang, 45 menit, 30 foto edit", price: "Rp 599K" },
      { name: "Premium", description: "All-in sesi premium, 60 menit, 40 foto edit + cetak", price: "Rp 899K" },
    ],
    features: ["Backdrop premium & variatif", "Props eksklusif tersedia", "Area studio lebih luas", "Tersedia ring light & softbox tambahan"],
    ctaLabel: "Hubungi Kami",
    ctaLink: "https://wa.me/6282331555431",
    accent: "dark",
  },
  {
    id: "fotografer",
    title: "Fotografer",
    subtitle: "With Photographer",
    description: "Sesi foto dengan fotografer profesional PAMA Studio. Arahan pose, pencahayaan diatur khusus, dan hasil edit berkualitas tinggi. Pilihan terbaik untuk yang ingin hasil terjamin tanpa repot.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    galleryImages: ["/images/foto11.jpg", "/images/foto12.jpg", "/images/foto1.jpg", "/images/foto3.jpg"],
    subPackages: [
      { name: "Personal", description: "Foto personal 1 orang, 45 menit, 20 foto edit", price: "Rp 499K" },
      { name: "Couple", description: "Foto couple/sahabat 2 orang, 60 menit, 30 foto edit", price: "Rp 749K" },
      { name: "Group", description: "Foto grup max 8 orang, 90 menit, 50 foto edit", price: "Rp 1.299K" },
    ],
    features: ["Fotografer profesional berpengalaman", "Arahan pose dari awal sampai akhir", "Setup pencahayaan khusus tiap sesi", "Hasil edit premium & natural"],
    ctaLabel: "Hubungi Kami",
    ctaLink: "https://wa.me/6282331555431",
    accent: "warm",
  }
];

/* ── Hero Header ── */
const PaketHero: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section className="relative overflow-hidden bg-[#FBF7F1] pt-32 pb-10 lg:pt-40 lg:pb-16">
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8B1A1A]/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-[350px] w-[350px] rounded-full bg-[#D4A373]/15 blur-[100px]" />
      
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")" }} />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Menggunakan Next.js Link untuk Beranda */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-[#8B1A1A]/20 bg-white/60 px-4 py-2 text-sm font-medium text-[#8B1A1A] backdrop-blur-sm transition hover:bg-white"
          style={{
            fontFamily: "Inter Tight, sans-serif",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Beranda
        </Link>

        {/* ... (Sisa kode PaketHero sama seperti aslinya) ... */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B1A1A]" style={{ fontFamily: "Inter Tight, sans-serif" }}>— Pilihan Paket</span>
            <h1 className="mt-3 text-4xl leading-[1.05] text-[#1a0505] sm:text-5xl lg:text-[64px]" style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}>Kenapa pilih <span className="italic text-[#8B1A1A]">PAMA Studio?</span></h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#3a1a1a]/70 lg:text-base" style={{ fontFamily: "Inter Tight, sans-serif" }}>Professional studio lighting, guided poses, and clean retouch — all in one seamless session at PAMA Studio. Pilih paket yang paling sesuai dengan kebutuhanmu.</p>
          </div>

          <div className="lg:col-span-5" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s" }}>
            <div className="grid grid-cols-3 gap-3">
              {[ { icon: <Camera className="h-5 w-5" />, label: "Studio", count: "2" }, { icon: <Users className="h-5 w-5" />, label: "Paket", count: "10+" }, { icon: <Sparkles className="h-5 w-5" />, label: "Fotografer", count: "Pro" } ].map((s, i) => (
                <div key={i} className="flex flex-col items-center rounded-2xl border border-[#8B1A1A]/10 bg-white/80 p-5 text-center backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">{s.icon}</div>
                  <div className="mt-3 text-2xl font-semibold text-[#1a0505]" style={{ fontFamily: "Fraunces, serif" }}>{s.count}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[#3a1a1a]/50" style={{ fontFamily: "Inter Tight, sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Main Page ── */
const PaketPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF7F1] text-[#1a0505]">
      <Navbar />
      <PaketHero />

      {/* Package Cards */}
      <section className="relative bg-[#FBF7F1] pb-16 lg:pb-24">
        <div className="pointer-events-none absolute left-0 top-1/4 h-[300px] w-[300px] rounded-full bg-[#8B1A1A]/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-2/3 h-[250px] w-[250px] rounded-full bg-[#D4A373]/10 blur-[80px]" />

        {/* Diubah menjadi max-w-7xl agar memanjang ke samping di laptop */}
        <div className="relative mx-auto max-w-7xl space-y-16 px-5 lg:px-8">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} data={pkg} index={i} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8B1A1A] via-[#761414] to-[#5C0E0E] py-16">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="text-3xl text-white sm:text-4xl lg:text-5xl" style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}>Masih bingung pilih paket?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/70 lg:text-base" style={{ fontFamily: "Inter Tight, sans-serif" }}>Tim kami siap membantu kamu memilih paket yang paling sesuai. Hubungi kami via WhatsApp dan konsultasikan kebutuhanmu.</p>
          <a href="https://wa.me/6282331555431" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#FFD7A8] hover:shadow-xl" style={{ fontFamily: "Inter Tight, sans-serif" }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.368 0-4.568-.817-6.297-2.183l-.44-.347-3.27 1.097 1.097-3.27-.347-.44A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Konsultasi via WhatsApp
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PaketPage;