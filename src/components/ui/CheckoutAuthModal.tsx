"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CalendarDays, Clock4 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browse";

type Mode = "login" | "register";

export default function CheckoutAuthModal({
  isOpen,
  onClose,
  title = "Login untuk lanjut booking",
  subtitle = "Masuk dulu biar kamu bisa pilih jadwal dan pesananmu tersimpan.",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setSuccess("");
      setLoading(false);
      setShowPassword(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const submit = async () => {
    setError("");
    setSuccess("");

    if (mode === "register" && !form.name.trim()) return setError("Nama wajib diisi.");
    if (!form.email.trim()) return setError("Email wajib diisi.");
    if (!form.password) return setError("Password wajib diisi.");
    if (form.password.length < 6) return setError("Password minimal 6 karakter.");

    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    data: { full_name: form.name },
    emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`,
  },
});

        setSuccess("Registrasi berhasil. Silakan login.");
        setMode("login");
        setForm((p) => ({ ...p, password: "" }));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) return setError(error.message);

        setSuccess("Login berhasil!");
        setTimeout(() => onClose(), 400);
      }
    } catch {
      setError("Gagal terhubung. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
      />

      {/* Modal */}
      <div className="relative mx-auto flex min-h-full max-w-4xl items-center justify-center px-4 py-10">
        <div className="relative w-full overflow-hidden rounded-[32px] border border-white/30 bg-white/75 shadow-[0_30px_90px_-30px_rgba(90,15,15,0.45)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Visual / Booking hint */}
            <div className="relative hidden min-h-[520px] overflow-hidden lg:block">
              <Image
                src="/images/foto6.jpg"
                alt="PAMA"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0505]/65 via-[#8B1A1A]/25 to-transparent" />

              <div className="absolute left-8 top-8 right-8">
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  PAMA Booking
                </div>

                <h3
                  className="mt-4 text-3xl text-white"
                  style={{ fontFamily: "Fraunces, serif", fontWeight: 400 }}
                >
                  Pilih jadwal <span className="italic text-[#FFD7A8]">tanpa bentrok</span>
                </h3>

                <p
                  className="mt-3 max-w-sm text-sm text-white/75"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  Setelah login, kamu bisa pilih tanggal & jam yang tersedia. Pesanan tersimpan dan bisa kamu track.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white">
                    <div className="flex items-center gap-2 text-white/90">
                      <CalendarDays className="h-4 w-4 text-[#FFD7A8]" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                        Kalender
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white/75" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                      Booking tanggal sesuai kebutuhanmu.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white">
                    <div className="flex items-center gap-2 text-white/90">
                      <Clock4 className="h-4 w-4 text-[#FFD7A8]" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                        Jam
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white/75" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                      Hanya jam yang available yang bisa dipilih.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative p-6 sm:p-8 lg:p-10">
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8B1A1A]/15 bg-white/70 text-[#8B1A1A] transition hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <h2 className="text-2xl text-[#1a0505]" style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[#3a1a1a]/70" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                  {subtitle}
                </p>
              </div>

              <div className="mt-6 flex gap-2 rounded-full border border-[#8B1A1A]/15 bg-white/70 p-1">
                {(["login", "register"] as const).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={[
                        "flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                        active ? "bg-[#8B1A1A] text-white" : "text-[#8B1A1A] hover:bg-white",
                      ].join(" ")}
                      style={{ fontFamily: "Inter Tight, sans-serif" }}
                    >
                      {m === "login" ? "Login" : "Register"}
                    </button>
                  );
                })}
              </div>

              {mode === "register" ? (
                <div className="mt-5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B1A1A]" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                    Nama
                  </label>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#8B1A1A]/15 bg-white/70 px-4 py-3">
                    <User className="h-4 w-4 text-[#8B1A1A]" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Nama kamu"
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B1A1A]" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                  Email
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#8B1A1A]/15 bg-white/70 px-4 py-3">
                  <Mail className="h-4 w-4 text-[#8B1A1A]" />
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B1A1A]" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                  Password
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#8B1A1A]/15 bg-white/70 px-4 py-3">
                  <Lock className="h-4 w-4 text-[#8B1A1A]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    className="text-[#8B1A1A]/80 transition hover:text-[#8B1A1A]"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                  {success}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8B1A1A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6B1212] disabled:opacity-60"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {mode === "login" ? "Login & Lanjut Booking" : "Daftar"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#8B1A1A]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#8B1A1A] transition hover:bg-white disabled:opacity-60"
                  style={{ fontFamily: "Inter Tight, sans-serif" }}
                >
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-xs text-[#3a1a1a]/55" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Dengan login, kamu setuju untuk melanjutkan proses booking dan data pesananmu akan tersimpan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}