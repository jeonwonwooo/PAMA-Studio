"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthRedirect, type AuthRedirectType } from "@/hooks/useAuthRedirect";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { useToast } from "@/contexts/ToastContext";

type Mode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  redirectType?: AuthRedirectType;
  packageId?: string;
  onAuthSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  title,
  subtitle,
  redirectType = "landing",
  packageId,
  onAuthSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const { handleAuthSuccess, clearLoginIntent } = useAuthRedirect();
  const supabase = createSupabaseBrowserClient();
  const { addToast } = useToast();

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setLoading(false);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 🔹 Helper
  const getCleanEmail = () => form.email.trim().toLowerCase();

  const validate = () => {
    if (!form.email || !form.password) return "Email dan password wajib diisi.";
    if (mode === "register" && !form.name.trim()) return "Nama wajib diisi.";
    if (form.password.length < 6) return "Password minimal 6 karakter.";
    return "";
  };

  // 🔥 HANDLE REGISTER
  const handleRegister = async () => {
    const email = getCleanEmail();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name.trim(), email, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registrasi gagal.");
    }

    setMode("login");
    setError(data.message || "Registrasi berhasil! Silakan login.");
  };

  // 🔥 HANDLE LOGIN
  const handleLogin = async () => {
    const email = getCleanEmail();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Email atau password salah.");
    }

    await supabase.auth.refreshSession();

    // Small delay to ensure session is fully refreshed
    await new Promise(resolve => setTimeout(resolve, 300));

    onClose();
    clearLoginIntent();

    // If custom success handler provided, use it
    if (onAuthSuccess) {
      onAuthSuccess();
      return;
    }

    const role = data.profile?.role || "client";

    // Admin always goes to admin dashboard
    if (role === "admin") {
      addToast("success", "Login berhasil!", "Selamat datang di dashboard admin.");
      router.push("/admin");
      router.refresh();
      return;
    }

    // Handle different redirect scenarios
    if (redirectType === "package" && packageId) {
      // From package card "Booking" button -> go to checkout
      addToast("success", "Login berhasil!", "Silakan lanjutkan booking paket pilihan kamu.");
      router.push(`/checkout?packageId=${packageId}`);
      router.refresh();
    } else if (redirectType === "checkout" && packageId) {
      // Already on checkout page -> stay there (handled by onAuthSuccess)
      addToast("success", "Login berhasil!", "Silakan pilih jadwal dan lanjutkan booking.");
      router.refresh();
    } else if (redirectType === "landing") {
      // From navbar "Pesan" button -> go to package list
      addToast("success", "Login berhasil!", "Pilih paket yang sesuai dengan kebutuhan kamu.");
      router.push("/paket");
      router.refresh();
    } else {
      // Default: go to dashboard
      addToast("success", "Login berhasil!", "Selamat datang kembali!");
      router.push("/dashboard-client");
      router.refresh();
    }
  };

  // 🔥 MAIN SUBMIT
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setError("");

    const validation = validate();
    if (validation) return setError(validation);

    setLoading(true);
    try {
      if (mode === "register") {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/30 bg-white/90 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row">
        <div className="relative hidden lg:block lg:w-[40%]">
          <Image src="/images/foto6.webp" alt="PAMA" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        </div>

        <div className="relative flex-1 p-8">
          <button onClick={onClose} className="absolute right-6 top-6 text-[#8B1A1A]">
            <X className="h-5 w-5" />
          </button>

          {title && <h2 className="text-2xl font-bold mb-2 text-[#1a0505]">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
          {!title && <h2 className="text-2xl font-bold mb-6 text-[#1a0505]">
            {mode === "login" ? "Masuk" : "Daftar Akun"}
          </h2>}

          <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 rounded-lg py-2 text-[10px] font-bold uppercase transition-all ${
                  mode === m ? "bg-[#8B1A1A] text-white shadow-md" : "text-gray-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="flex items-center gap-3 rounded-xl border p-3 bg-white">
                <User className="h-4 w-4 text-[#8B1A1A]" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full text-sm outline-none"
                  placeholder="Nama Lengkap"
                  disabled={loading}
                />
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border p-3 bg-white">
              <Mail className="h-4 w-4 text-[#8B1A1A]" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full text-sm outline-none"
                placeholder="Email"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-3 bg-white">
              <Lock className="h-4 w-4 text-[#8B1A1A]" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full text-sm outline-none"
                placeholder="Password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-[10px] text-red-600 font-bold text-center leading-tight">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="w-full mt-8 bg-[#8B1A1A] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#6B1212] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "MASUK" : "DAFTAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
