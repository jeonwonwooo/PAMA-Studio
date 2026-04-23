"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ShoppingBag, ArrowUpRight } from "lucide-react";
import AuthModal from "@/components/ui/AuthModal";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePesanClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push("/paket");
    } else {
      setAuthOpen(true);
    }
  };

  const links = [
    { label: "Beranda", href: "/#beranda" },
    { label: "Portofolio", href: "/#portofolio" },
    { label: "Paket", href: "/#paket" },
    { label: "Kontak", href: "/#kontak" },
  ];

  return (
    <>
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
                ? "border-white/40 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(120,20,20,0.25)] px-4 py-2"
                : "border-white/30 bg-[#ffffff]/70 backdrop-blur-md px-5 py-3",
            ].join(" ")}
          >
            {/* Logo */}
            <a href="#beranda" className="flex items-center gap-2 pl-1">
              <div className="relative h-11 w-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#8B1A1A]/10 blur-sm" />
                <div className="absolute inset-0 rounded-full border border-[#8B1A1A]/25 z-10" />
                <div className="relative h-full w-full overflow-hidden rounded-full bg-[#ffffff]">
                  <Image
                    src="/logo.png"
                    alt="Logo PAMA"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>
              <div className="leading-none">
                <div className="text-[17px] font-semibold text-[#2a0a0a]">
                  PAMA
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#8B1A1A]/80">
                  Studio
                </div>
              </div>
            </a>

            {/* Desktop links */}
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="group relative rounded-full px-4 py-2 text-sm font-medium text-[#2a0a0a]/80 transition hover:text-[#8B1A1A]"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* 🔥 PESAN BUTTON */}
              <button
                onClick={handlePesanClick}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] px-5 py-2.5 text-sm font-medium text-white"
              >
                Pesan
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 bg-white/70 text-[#8B1A1A]">
                <ShoppingBag className="h-4 w-4" />
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/20 bg-white/70 text-[#8B1A1A] md:hidden"
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile */}
          {menuOpen && (
            <div className="mt-2 rounded-3xl border bg-white p-3 md:hidden">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3"
                >
                  {l.label}
                </a>
              ))}

              {/* 🔥 PESAN SEKARANG */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handlePesanClick();
                }}
                className="mt-2 w-full rounded-2xl bg-[#8B1A1A] px-4 py-3 text-white"
              >
                Pesan Sekarang
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;