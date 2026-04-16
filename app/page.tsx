"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Sparkles,
  Wand2,
  HeartHandshake,
  Star,
  Quote,
  MapPin,
  Phone,
  Mail,
  Music2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ----------------------------------------------------------------------------
   PAMA STUDIO — Editorial Photography Landing Page
   Aesthetic: Refined editorial luxury. Maroon + cream + ivory.
   Typography: Fraunces (display serif) + Inter Tight (body).
---------------------------------------------------------------------------- */

/* ============================ NAVBAR ==================================== */
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Beranda", href: "#beranda" },
    { label: "Portofolio", href: "#portofolio" },
    { label: "Paket", href: "#paket" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          className={[
            "relative flex items-center justify-between rounded-full border transition-all duration-500",
            scrolled
              ? "border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(120,20,20,0.25)] px-4 py-2"
              : "border-white/30 bg-white/30 backdrop-blur-md px-5 py-3",
          ].join(" ")}
        >
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-2 pl-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#8B1A1A]/20 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#5C0E0E] text-white shadow-lg">
                <span
                  className="text-[15px] font-bold tracking-tight"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  P
                </span>
              </div>
            </div>
            <div className="leading-none">
              <div
                className="text-[17px] font-semibold text-[#2a0a0a]"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                PAMA
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.22em] text-[#8B1A1A]/80"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                Studio
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <nav
            className="hidden items-center gap-1 md:flex"
            style={{ fontFamily: "Inter Tight, sans-serif" }}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-[#2a0a0a]/80 transition hover:text-[#8B1A1A]"
              >
                {l.label}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-[#8B1A1A] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="#paket"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] px-5 py-2.5 text-sm font-medium text-white shadow-[0_6px_20px_-6px_rgba(139,26,26,0.6)] transition hover:shadow-[0_10px_28px_-6px_rgba(139,26,26,0.7)] hover:-translate-y-0.5"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Pesan
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </a>
            <button
              aria-label="Cart"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 bg-white/70 text-[#8B1A1A] backdrop-blur-md transition hover:bg-white"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 bg-white/70 text-[#8B1A1A] backdrop-blur-md md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="mt-2 rounded-3xl border border-white/40 bg-white/80 p-3 backdrop-blur-xl shadow-lg md:hidden"
            style={{ fontFamily: "Inter Tight, sans-serif" }}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#2a0a0a] hover:bg-[#8B1A1A]/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#paket"
              onClick={() => setMenuOpen(false)}
              className="mt-1 block rounded-2xl bg-[#8B1A1A] px-4 py-3 text-center text-sm font-medium text-white"
            >
              Pesan Sekarang
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

/* ============================ HERO ====================================== */
const Hero: React.FC = () => {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-[#FBF7F1] pt-32 pb-16 lg:pt-40 lg:pb-24"
    >
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#8B1A1A]/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-[#D4A373]/20 blur-[100px]" />

      {/* Subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Text */}
          <div className="lg:col-span-7 lg:pt-6">
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[#8B1A1A]/20 bg-white/60 px-4 py-1.5 backdrop-blur-sm"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B1A1A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8B1A1A]" />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8B1A1A]">
                Studio foto profesional sejak 2023
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-6 text-[44px] leading-[1.02] text-[#1a0505] sm:text-[60px] lg:text-[84px]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Abadikan versi{" "}
              <span className="italic font-light text-[#8B1A1A]">
                terbaikmu
              </span>
              <br />
              dengan <span className="font-semibold">mudah.</span>
            </h1>

            <p
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#3a1a1a]/75 lg:text-base"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Pencahayaan studio yang dirancang khusus, arahan pose dari tim
              fotografer berpengalaman, dan hasil edit rapi yang mengangkat
              karaktermu — semua dalam satu sesi yang nyaman di PAMA Studio.
            </p>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-wrap items-center gap-3"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              <a
                href="#paket"
                className="group inline-flex items-center gap-2 rounded-full bg-[#8B1A1A] px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(139,26,26,0.6)] transition hover:bg-[#6B1212] hover:shadow-[0_14px_36px_-10px_rgba(139,26,26,0.8)]"
              >
                Selengkapnya
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#portofolio"
                className="group inline-flex items-center gap-2 rounded-full border border-[#8B1A1A]/30 bg-white/60 px-6 py-3.5 text-sm font-medium text-[#8B1A1A] backdrop-blur-sm transition hover:bg-white"
              >
                Lihat Portofolio
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Mini stats row */}
            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                ].map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt="client"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full border-2 border-[#FBF7F1] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#8B1A1A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-[#1a0505]">
                    4.9/5
                  </span>
                </div>
                <div className="text-xs text-[#3a1a1a]/60">
                  500+ klien puas
                </div>
              </div>
            </div>
          </div>

          {/* Image collage */}
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(90,15,15,0.5)]">
              <Image
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop"
                alt="PAMA Studio hero"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505]/25 via-transparent to-transparent" />

              {/* Floating badge */}
              <div
                className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-md"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                <Camera className="h-3.5 w-3.5 text-[#8B1A1A]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a0505]">
                  Studio Pro
                </span>
              </div>
            </div>

            {/* Floating card */}
            <div
              className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur-md sm:block"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold text-[#1a0505]"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    Hasil Premium
                  </div>
                  <div className="text-[11px] text-[#3a1a1a]/60">
                    Edit rapi, siap upload
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===================== WHY CHOOSE PAMA ================================== */
const WhyChoose: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="h-5 w-5" strokeWidth={1.75} />,
      title: "Lighting Profesional",
      desc: "Setup pencahayaan studio yang bersih, lembut, dan dikurasi untuk setiap bentuk wajah.",
    },
    {
      icon: <Camera className="h-5 w-5" strokeWidth={1.75} />,
      title: "Arahan Pose",
      desc: "Tim fotografer aktif memandu pose agar kamu tetap rileks dan natural di depan kamera.",
    },
    {
      icon: <Wand2 className="h-5 w-5" strokeWidth={1.75} />,
      title: "Edit Rapi & Natural",
      desc: "Retouching halus yang menjaga karakter asli — bukan filter berlebih, tapi versi terbaikmu.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5" strokeWidth={1.75} />,
      title: "Pelayanan Nyaman",
      desc: "Suasana studio yang hangat, tim yang ramah, dan proses yang tidak terasa terburu-buru.",
    },
  ];

  return (
    <section className="relative bg-[#FBF7F1] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Top row: image + text */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(90,15,15,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=700&fit=crop"
                alt="PAMA team"
                fill
                unoptimized
                className="object-cover"
              />
              <div
                className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8B1A1A] backdrop-blur-md"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                Since 2023
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <span
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8B1A1A]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              — Mengapa Kami
            </span>
            <h2
              className="mt-3 text-4xl leading-[1.05] text-[#1a0505] sm:text-5xl lg:text-[54px]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Kenapa pilih{" "}
              <span className="italic text-[#8B1A1A]">PAMA Studio?</span>
            </h2>
            <p
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#3a1a1a]/75"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Berdiri sejak 2023, PAMA Studio hadir membawa layanan fotografi
              yang matang dan profesional. Kami merangkai setiap momen dengan
              hasil yang estetik, detail yang dipikirkan, dan pelayanan yang
              membuat siapa pun nyaman — dari pertama kali masuk studio sampai
              menerima file akhir.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[#8B1A1A]/10 bg-gradient-to-br from-[#FFF8E7] to-[#FDEFD0] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(139,26,26,0.3)]"
            >
              {/* Accent circle */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#8B1A1A]/5 transition-all duration-500 group-hover:scale-150" />

              {/* Number */}
              <div
                className="absolute right-5 top-5 text-xs font-semibold text-[#8B1A1A]/40"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                0{i + 1}
              </div>

              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A] text-white shadow-md">
                  {f.icon}
                </div>
                <h3
                  className="mt-5 text-lg font-semibold text-[#1a0505]"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-[#3a1a1a]/70"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================ STATS ===================================== */
const Stats: React.FC = () => {
  const stats = [
    { value: "500+", label: "Sesi Foto" },
    { value: "500K+", label: "Frame Diabadikan" },
    { value: "98%", label: "Tingkat Kepuasan" },
    { value: "1000+", label: "Klien Bahagia" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#8B1A1A] via-[#761414] to-[#5C0E0E] py-14">
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={[
                "flex flex-col items-center text-center",
                i < 3 ? "lg:border-r lg:border-white/20" : "",
              ].join(" ")}
            >
              <div
                className="text-5xl font-semibold text-white sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                {s.value}
              </div>
              <div
                className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-white/70"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================ PORTFOLIO ================================= */
const Portfolio: React.FC = () => {
  const row1 = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=750&fit=crop",
  ];
  const row2 = [
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=600&h=750&fit=crop",
    "https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=600&h=750&fit=crop",
  ];

  return (
    <section id="portofolio" className="relative bg-[#FBF7F1] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B1A1A]"
            style={{ fontFamily: "Inter Tight, sans-serif" }}
          >
            — Our work
          </span>
          <h2
            className="mt-3 text-4xl text-[#1a0505] sm:text-5xl lg:text-[58px]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >
            Porto<span className="italic text-[#8B1A1A]">folio</span>
          </h2>
          <p
            className="mt-4 max-w-xl text-sm text-[#3a1a1a]/70 lg:text-base"
            style={{ fontFamily: "Inter Tight, sans-serif" }}
          >
            Kumpulan sesi terpilih yang membawa karakter, emosi, dan cerita
            setiap klien kami.
          </p>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="relative mt-12 space-y-5 overflow-hidden">
        {/* gradient edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FBF7F1] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FBF7F1] to-transparent sm:w-32" />

        {/* Row 1 — scrolls left */}
        <div className="group flex gap-5 overflow-hidden">
          <div className="flex shrink-0 animate-[marqueeLeft_45s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((src, i) => (
              <div
                key={`r1-${i}`}
                className="relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-80 sm:w-60"
              >
                <Image
                  src={src}
                  alt={`Portfolio ${i}`}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="group flex gap-5 overflow-hidden">
          <div className="flex shrink-0 animate-[marqueeRight_50s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((src, i) => (
              <div
                key={`r2-${i}`}
                className="relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-80 sm:w-60"
              >
                <Image
                  src={src}
                  alt={`Portfolio ${i}`}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

/* ========================== BEST SELLER ================================= */
const BestSeller: React.FC = () => {
  const packages = [
    {
      name: "Signature Solo",
      price: "IDR 299K",
      tag: "Paling Populer",
      features: ["1 Orang", "30 menit sesi", "15 foto edit", "2 wardrobe"],
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop",
    },
    {
      name: "Duo Portrait",
      price: "IDR 499K",
      tag: "Favorit Couple",
      features: ["2 Orang", "45 menit sesi", "25 foto edit", "3 wardrobe"],
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=700&fit=crop",
      featured: true,
    },
    {
      name: "Squad Session",
      price: "IDR 899K",
      tag: "Terlaris Grup",
      features: ["Up to 6 Orang", "60 menit sesi", "40 foto edit", "Free props"],
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=700&fit=crop",
    },
  ];

  return (
    <section
      id="paket"
      className="relative overflow-hidden bg-gradient-to-br from-[#8B1A1A] via-[#761414] to-[#5C0E0E] py-16 lg:py-24"
    >
      {/* subtle dots */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFD7A8]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              — Best Seller
            </span>
            <h2
              className="mt-3 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-[58px]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Paket <span className="italic">favorit</span>
              <br />
              para pelanggan kami.
            </h2>
            <p
              className="mt-4 max-w-xl text-sm text-white/70 lg:text-base"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Dipilih paling banyak karena memberikan hasil foto terbaik dengan
              harga yang tetap terjangkau. Cocok untuk kamu yang ingin tampil
              maksimal tanpa ribet.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a
              href="#kontak"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#8B1A1A] transition hover:bg-[#FFD7A8]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Pilih Paket
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => (
            <div
              key={i}
              className={[
                "group relative overflow-hidden rounded-[28px] transition duration-500",
                p.featured
                  ? "bg-[#FBF7F1] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] lg:-translate-y-4"
                  : "bg-white/95 hover:-translate-y-2",
              ].join(" ")}
            >
              {/* image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Tag */}
                <div
                  className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8B1A1A] backdrop-blur-md"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  {p.tag}
                </div>

                {/* Price badge */}
                {p.featured && (
                  <div
                    className="absolute right-4 top-4 rounded-full bg-[#8B1A1A] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                    style={{ fontFamily: "Inter Tight, sans-serif" }}
                  >
                    Pilihan Kami
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3
                    className="text-2xl text-white"
                    style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
                  >
                    {p.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <div
                    className="text-3xl font-semibold text-[#1a0505]"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    {p.price}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-wider text-[#3a1a1a]/50"
                    style={{ fontFamily: "Inter Tight, sans-serif" }}
                  >
                    / sesi
                  </div>
                </div>

                <ul
                  className="mt-5 space-y-2.5"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-sm text-[#3a1a1a]/80"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                        <svg
                          className="h-2.5 w-2.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                          />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontak"
                  className={[
                    "mt-6 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
                    p.featured
                      ? "bg-[#8B1A1A] text-white hover:bg-[#6B1212]"
                      : "border border-[#8B1A1A]/30 text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white hover:border-transparent",
                  ].join(" ")}
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  Pesan Sekarang
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========================== TESTIMONIALS ================================ */
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Nadia Pramesti",
      role: "Fresh Graduate",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      text: "Jujur, aku biasanya canggung di depan kamera. Tapi tim PAMA sabar banget ngarahin sampai aku rileks. Hasilnya? Aku nggak berhenti pamer ke temen-temen.",
      rating: 5,
    },
    {
      name: "Rangga Wicaksono",
      role: "Content Creator",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      text: "Lighting-nya juara. Editnya bersih tapi tetap natural — bukan filter yang bikin wajah jadi plastik. Bakal balik lagi untuk sesi branding.",
      rating: 5,
    },
    {
      name: "Salma Anindita",
      role: "Mahasiswi",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      text: "Dari booking sampai penerimaan file, semuanya smooth. Studionya nyaman, ada wardrobe yang bisa dipinjam juga. Value for money banget!",
      rating: 5,
    },
    {
      name: "Bintang Mahardika",
      role: "Young Professional",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      text: "Butuh foto LinkedIn profesional, dikasih hasil yang jauh melebihi ekspektasi. Udah dipakai buat profil kantor dan banyak yang nanya fotografer mana.",
      rating: 5,
    },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-[#FBF7F1] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="lg:col-span-4">
            <span
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B1A1A]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              — Testimoni
            </span>
            <h2
              className="mt-3 text-4xl leading-[1.05] text-[#1a0505] sm:text-5xl lg:text-[48px]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Pengalaman<br />
              mereka di <span className="italic text-[#8B1A1A]">PAMA Studio</span>
            </h2>
            <p
              className="mt-5 max-w-sm text-sm text-[#3a1a1a]/70"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Cerita tulus dari mereka yang pernah mempercayakan momennya pada
              kami.
            </p>

            {/* Featured avatar */}
            <div className="mt-8 flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#8B1A1A]/20 blur-md" />
                <Image
                  src={testimonials[active].img}
                  alt={testimonials[active].name}
                  width={64}
                  height={64}
                  unoptimized
                  className="relative h-16 w-16 rounded-full border-2 border-white object-cover shadow-lg"
                />
              </div>
              <div>
                <div
                  className="text-base font-semibold text-[#1a0505]"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {testimonials[active].name}
                </div>
                <div
                  className="text-xs text-[#3a1a1a]/60"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  {testimonials[active].role}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() =>
                  setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setActive((a) => (a + 1) % testimonials.length)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div
                className="ml-4 text-xs text-[#3a1a1a]/50"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Right - cards */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={[
                    "group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500",
                    active === i
                      ? "border-transparent bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] shadow-[0_20px_40px_-20px_rgba(139,26,26,0.5)]"
                      : "border-[#8B1A1A]/15 bg-white hover:border-[#8B1A1A]/30",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={t.img}
                      alt={t.name}
                      width={48}
                      height={48}
                      unoptimized
                      className={[
                        "h-12 w-12 shrink-0 rounded-full border-2 object-cover transition",
                        active === i ? "border-white" : "border-[#8B1A1A]/20",
                      ].join(" ")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div
                            className={[
                              "text-sm font-semibold",
                              active === i ? "text-white" : "text-[#1a0505]",
                            ].join(" ")}
                            style={{ fontFamily: "Fraunces, serif" }}
                          >
                            {t.name}
                          </div>
                          <div
                            className={[
                              "text-[11px]",
                              active === i ? "text-white/70" : "text-[#3a1a1a]/50",
                            ].join(" ")}
                            style={{ fontFamily: "Inter Tight, sans-serif" }}
                          >
                            {t.role}
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(t.rating)].map((_, j) => (
                            <Star
                              key={j}
                              className={[
                                "h-3 w-3 fill-current",
                                active === i
                                  ? "text-[#FFD7A8]"
                                  : "text-[#8B1A1A]",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                      </div>
                      <p
                        className={[
                          "mt-2 text-sm leading-relaxed",
                          active === i ? "text-white/90" : "text-[#3a1a1a]/75",
                        ].join(" ")}
                        style={{ fontFamily: "Inter Tight, sans-serif" }}
                      >
                        “{t.text}”
                      </p>
                    </div>
                    <Quote
                      className={[
                        "h-5 w-5 shrink-0 transition",
                        active === i ? "text-white/40" : "text-[#8B1A1A]/20",
                      ].join(" ")}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================ CONTACT =================================== */
const Contact: React.FC = () => {
  return (
    <section id="kontak" className="relative bg-[#FBF7F1]">
      {/* Banner */}
      <div className="bg-[#8B1A1A] py-5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2
            className="text-center text-2xl text-white sm:text-3xl"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
          >
            Temukan Kami di Sini
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left - Title + Map */}
          <div className="lg:col-span-7">
            <span
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B1A1A]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              — Contact Us
            </span>
            <h3
              className="mt-3 text-4xl leading-[1.05] text-[#1a0505] sm:text-5xl"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
            >
              Mari <span className="italic text-[#8B1A1A]">terhubung</span>
            </h3>
            <p
              className="mt-4 max-w-lg text-sm text-[#3a1a1a]/70"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Mampir langsung ke studio atau kirim pesan — tim kami akan membantu
              merencanakan sesi foto yang tepat untukmu.
            </p>

            {/* Embedded map */}
            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#8B1A1A]/10 shadow-[0_20px_60px_-20px_rgba(90,15,15,0.3)]">
              <iframe
                title="PAMA Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15826.977093891453!2d112.7378!3d-7.2574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381e6b07%3A0x1!2sSurabaya%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right - Contact info */}
          <div className="lg:col-span-5">
            <h4
              className="text-2xl text-[#1a0505] sm:text-3xl"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
            >
              Lokasi Kami
            </h4>

            <div
              className="mt-6 space-y-3"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              {[
                {
                  icon: <MapPin className="h-4 w-4" />,
                  label: "Alamat Studio",
                  value: "Jl. Raya Sidoarjo No. 123, Jawa Timur",
                },
                {
                  icon: <Mail className="h-4 w-4" />,
                  label: "Email",
                  value: "cs@pamastudio.com",
                },
                {
                  icon: <Phone className="h-4 w-4" />,
                  label: "WhatsApp",
                  value: "+62 812-3333-4455",
                },
                {
                  icon: <Music2 className="h-4 w-4" />,
                  label: "TikTok",
                  value: "@pama.studio",
                },
              ].map((c, i) => (
                <a
                  key={i}
                  href="#"
                  className="group flex items-center justify-between rounded-2xl bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] p-4 text-white shadow-[0_10px_30px_-15px_rgba(139,26,26,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-15px_rgba(139,26,26,0.8)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-white/60">
                        {c.label}
                      </div>
                      <div className="text-sm font-medium">{c.value}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a0505] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#8B1A1A]"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              <MapPin className="h-4 w-4" />
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================ FOOTER ==================================== */
const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#5C0E0E] via-[#4a0a0a] to-[#2a0505] text-white">
      {/* Decorative */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#8B1A1A]/30 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#8B1A1A] shadow-lg">
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  P
                </span>
              </div>
              <div>
                <div
                  className="text-xl font-semibold"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  PAMA Studio
                </div>
                <div
                  className="text-[11px] uppercase tracking-[0.22em] text-white/60"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  Self Photo Studio
                </div>
              </div>
            </div>
            <p
              className="mt-5 max-w-xs text-sm leading-relaxed text-white/60"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              Mengabadikan hubungan, kualitas, dan higienitas dalam satu studio
              self-photo yang nyaman — spesial untukmu.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: <Camera className="h-4 w-4" />, label: "Instagram" }, // Sementara pakai Camera
                { icon: <Music2 className="h-4 w-4" />, label: "TikTok" },
                { icon: <Mail className="h-4 w-4" />, label: "Email" },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white hover:bg-white hover:text-[#8B1A1A]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ fontFamily: "Inter Tight, sans-serif" }}>
            <div
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Info
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <a href="#" className="transition hover:text-white">
                  FAQ & Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Metode Pembayaran
                </a>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div style={{ fontFamily: "Inter Tight, sans-serif" }}>
            <div
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Pages
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <a href="#beranda" className="transition hover:text-white">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#portofolio" className="transition hover:text-white">
                  Portofolio
                </a>
              </li>
              <li>
                <a href="#paket" className="transition hover:text-white">
                  Paket & Harga
                </a>
              </li>
              <li>
                <a href="#kontak" className="transition hover:text-white">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div
            className="col-span-2 md:col-span-4 lg:col-span-1"
            style={{ fontFamily: "Inter Tight, sans-serif" }}
          >
            <div
              className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Contact
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD7A8]" />
                Sidoarjo, Jawa Timur
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD7A8]" />
                cs@pamastudio.com
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD7A8]" />
                +62 812-3333-4455
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row"
          style={{ fontFamily: "Inter Tight, sans-serif" }}
        >
          <div>© 2026 PAMA Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="transition hover:text-white">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ============================ ROOT ====================================== */
const PamaStudio: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF7F1] text-[#1a0505]">
      <Navbar />
      <Hero />
      <WhyChoose />
      <Stats />
      <Portfolio />
      <BestSeller />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default PamaStudio;