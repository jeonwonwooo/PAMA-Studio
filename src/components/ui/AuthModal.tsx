"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/browse";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const validate = () => {
    if (mode === "register" && !form.name) return "Nama wajib diisi";
    if (!form.email) return "Email wajib diisi";
    if (!form.password) return "Password wajib diisi";
    if (form.password.length < 6) return "Minimal 6 karakter";
    return "";
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const err = validate();
    if (err) return setError(err);

    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
          },
        });

        if (error) return setError(error.message);

        setSuccess("Registrasi berhasil! Silakan login.");
        setMode("login");
        setForm({ name: "", email: "", password: "" });

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) return setError(error.message);

        setSuccess("Login berhasil!");

        setTimeout(() => {
          onClose();
          router.push("/paket"); // 🔥 redirect utama
        }, 500);
      }
    } catch {
      setError("Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">

          {/* Header */}
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
              <h2 className="font-semibold text-lg">PAMA Studio</h2>
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              {mode === "login" ? "Login" : "Register"}
            </h3>

            {/* Error */}
            {error && (
              <div className="mt-3 text-red-500 text-sm">{error}</div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-3 text-green-600 text-sm">{success}</div>
            )}

            {/* Form */}
            <div className="mt-4 space-y-3">

              {mode === "register" && (
                <input
                  type="text"
                  placeholder="Nama"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border p-3 rounded-lg"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded-lg"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border p-3 rounded-lg pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#8B1A1A] text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : null}
                {mode === "login" ? "Login" : "Register"}
                <ArrowRight />
              </button>

              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-center w-full text-[#8B1A1A]"
              >
                {mode === "login"
                  ? "Belum punya akun? Register"
                  : "Sudah punya akun? Login"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;