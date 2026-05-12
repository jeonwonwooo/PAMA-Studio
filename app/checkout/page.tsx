"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBF7F1] text-[#1a0505] flex flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#8B1A1A] mx-auto mb-4" />
            <p className="text-[#3a1a1a]/60">Memuat checkout...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}