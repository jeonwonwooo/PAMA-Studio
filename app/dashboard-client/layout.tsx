"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout, ready } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const userInitials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard-client" },
    { label: "Pesanan Saya", icon: ShoppingBag, href: "/dashboard-client/orders" },
    { label: "Profil", icon: User, href: "/dashboard-client/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F1] flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#8B1A1A]/10 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl">
              <Image src="/logo.png" alt="Logo PAMA" fill className="object-contain" />
            </div>
            <span
              className="font-serif text-xl text-[#1a0505] font-bold"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              PAMA <span className="italic text-[#8B1A1A]">Studio</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                    ${
                      isActive
                        ? "bg-[#8B1A1A] text-white shadow-lg shadow-[#8B1A1A]/20"
                        : "text-[#3a1a1a]/60 hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                    }
                  `}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {ready && (
            <div className="mt-4 mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1A1A] text-white text-sm font-bold">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-[#1a0505]">
                    {profile?.full_name ?? "User"}
                  </p>
                  <p className="text-xs text-[#8B1A1A]/60 truncate capitalize">
                    {profile?.role ?? "Client"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors mt-auto"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#8B1A1A]/10">
          <span
            className="font-serif font-bold text-[#8B1A1A]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            PAMA
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#8B1A1A]"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
