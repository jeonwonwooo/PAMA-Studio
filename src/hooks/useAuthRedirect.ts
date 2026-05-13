"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export type AuthRedirectType = "landing" | "package" | "checkout";

interface AuthRedirectConfig {
  type: AuthRedirectType;
  packageId?: string;
  returnUrl?: string;
}

export function useAuthRedirect() {
  const router = useRouter();
  const { addToast } = useToast();

  /**
   * Handle redirect after successful authentication
   * @param config - Configuration for redirect behavior
   */
  const handleAuthSuccess = useCallback(
    (config: AuthRedirectConfig) => {
      let redirectUrl = "/paket";
      let notificationTitle = "Login berhasil!";
      let notificationMessage = "Pilih paket yang sesuai dengan kebutuhan kamu.";

      if (config.type === "package" && config.packageId) {
        // Redirect ke checkout dengan package ID
        redirectUrl = `/checkout?packageId=${config.packageId}`;
        notificationTitle = "Login berhasil!";
        notificationMessage = "Lanjut ke halaman booking paket pilihan kamu.";
      } else if (config.type === "checkout") {
        // Redirect ke checkout (packageId should be passed in config)
        if (config.packageId) {
          redirectUrl = `/checkout?packageId=${config.packageId}`;
        } else {
          // Try to get from current URL
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const packageId = params.get("packageId");
            if (packageId) {
              redirectUrl = `/checkout?packageId=${packageId}`;
            }
          }
        }
        notificationMessage = "Kamu siap untuk melakukan booking.";
      } else if (config.returnUrl) {
        // Use custom return URL
        redirectUrl = config.returnUrl;
      }

      // Show notification
      addToast("success", notificationTitle, notificationMessage);

      // Redirect after short delay to allow toast to render
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 500);
    },
    [router, addToast]
  );

  /**
   * Store intent to login before showing auth modal
   * This is useful for tracking where user initiated login
   */
  const storeLoginIntent = useCallback(
    (type: AuthRedirectType, packageId?: string) => {
      sessionStorage.setItem(
        "authRedirectIntent",
        JSON.stringify({ type, packageId, timestamp: Date.now() })
      );
    },
    []
  );

  /**
   * Get stored login intent
   */
  const getLoginIntent = useCallback((): AuthRedirectConfig | null => {
    if (typeof window === "undefined") return null;

    const stored = sessionStorage.getItem("authRedirectIntent");
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      // Clear old intents (older than 10 minutes)
      if (Date.now() - parsed.timestamp > 10 * 60 * 1000) {
        sessionStorage.removeItem("authRedirectIntent");
        return null;
      }
      return { type: parsed.type, packageId: parsed.packageId };
    } catch {
      return null;
    }
  }, []);

  /**
   * Clear stored login intent
   */
  const clearLoginIntent = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("authRedirectIntent");
  }, []);

  return {
    handleAuthSuccess,
    storeLoginIntent,
    getLoginIntent,
    clearLoginIntent,
  };
}
