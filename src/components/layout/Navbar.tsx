"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ShoppingBag, ArrowUpRight } from "lucide-react";
import AuthModal from "@/components/ui/AuthModal";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

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
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] px-5 py-2.5 text-sm font-medium text-white shadow-[0_6px_20px_-6px_rgba(139,26,26,0.6)] transition hover:shadow-[0_10px_28px_-6px_rgba(139,26,26,0.7)] hover:-translate-y-0.5"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
              >
                Pesan
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
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
              className="mt-2 rounded-3xl border border-white/40 bg-[#ffffff]/90 p-3 backdrop-blur-xl shadow-lg md:hidden"
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
              <button
                onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
                className="mt-1 block w-full rounded-2xl bg-[#8B1A1A] px-4 py-3 text-center text-sm font-medium text-white"
              >
                Pesan Sekarang
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;