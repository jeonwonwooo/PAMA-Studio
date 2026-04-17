"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) errs.name = "Nama wajib diisi";
    if (!form.email.trim()) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Format email salah";
    if (!form.password) errs.password = "Password wajib diisi";
    else if (form.password.length < 6) errs.password = "Minimal 6 karakter";
    return errs;
  }, [mode, form]);

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSuccess("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ api: data.message || "Terjadi kesalahan" });
      } else {
        setSuccess(mode === "login" ? "Login berhasil!" : "Registrasi berhasil! Silakan login.");
        if (mode === "register") {
          setTimeout(() => { setMode("login"); setSuccess(""); setForm({ name: "", email: "", password: "" }); }, 1500);
        } else {
          setTimeout(() => { onClose(); setForm({ name: "", email: "", password: "" }); }, 1000);
        }
      }
    } catch {
      setErrors({ api: "Tidak dapat terhubung ke server" });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
    setSuccess("");
    setForm({ name: "", email: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a0505]/60 backdrop-blur-sm animate-[fadeIn_300ms_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-[modalIn_400ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="overflow-hidden rounded-[28px] border border-white/40 bg-white shadow-[0_40px_100px_-30px_rgba(90,15,15,0.5)]">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#8B1A1A] via-[#D4A373] to-[#8B1A1A]" />

          <div className="p-7 sm:p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-5 top-7 flex h-8 w-8 items-center justify-center rounded-full text-[#3a1a1a]/50 transition hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#8B1A1A]/20 bg-[#fdf6f0]">
                <Image src="/logo.png" alt="Logo PAMA" fill className="object-contain p-1" />
              </div>
              <div>
                <div className="text-lg font-semibold text-[#2a0a0a]" style={{ fontFamily: "Fraunces, serif" }}>
                  PAMA Studio
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2
              className="mt-5 text-2xl text-[#1a0505] sm:text-3xl"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }}
            >
              {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
            </h2>
            <p
              className="mt-1.5 text-sm text-[#3a1a1a]/60"
              style={{ fontFamily: "Inter Tight, sans-serif" }}
            >
              {mode === "login"
                ? "Masuk untuk memesan sesi foto di PAMA Studio"
                : "Daftar untuk mulai memesan sesi foto"}
            </p>

            {/* Success message */}
            {success && (
              <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
                style={{ fontFamily: "Inter Tight, sans-serif" }}>
                {success}
              </div>
            )}

            {/* API Error */}
            {errors.api && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
                style={{ fontFamily: "Inter Tight, sans-serif" }}>
                {errors.api}
              </div>
            )}

            {/* Form fields */}
            <div className="mt-6 space-y-4" style={{ fontFamily: "Inter Tight, sans-serif" }}>
              {/* Name (register only) */}
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#3a1a1a]/60">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B1A1A]/40" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={[
                        "w-full rounded-xl border bg-[#FBF7F1] py-3 pl-10 pr-4 text-sm text-[#1a0505] outline-none transition",
                        "placeholder:text-[#3a1a1a]/30 focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10",
                        errors.name ? "border-red-400" : "border-[#8B1A1A]/15",
                      ].join(" ")}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#3a1a1a]/60">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B1A1A]/40" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={[
                      "w-full rounded-xl border bg-[#FBF7F1] py-3 pl-10 pr-4 text-sm text-[#1a0505] outline-none transition",
                      "placeholder:text-[#3a1a1a]/30 focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10",
                      errors.email ? "border-red-400" : "border-[#8B1A1A]/15",
                    ].join(" ")}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#3a1a1a]/60">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B1A1A]/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className={[
                      "w-full rounded-xl border bg-[#FBF7F1] py-3 pl-10 pr-11 text-sm text-[#1a0505] outline-none transition",
                      "placeholder:text-[#3a1a1a]/30 focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10",
                      errors.password ? "border-red-400" : "border-[#8B1A1A]/15",
                    ].join(" ")}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a1a1a]/40 hover:text-[#8B1A1A]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#6B1212] py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(139,26,26,0.6)] transition hover:shadow-[0_12px_32px_-8px_rgba(139,26,26,0.8)] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Masuk" : "Daftar"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#8B1A1A]/10" />
                <span className="text-xs text-[#3a1a1a]/40">atau</span>
                <div className="h-px flex-1 bg-[#8B1A1A]/10" />
              </div>

              {/* Switch mode */}
              <button
                onClick={switchMode}
                className="w-full rounded-xl border border-[#8B1A1A]/20 py-3 text-sm font-medium text-[#8B1A1A] transition hover:bg-[#8B1A1A]/5"
              >
                {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;