"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer, { ToastType } from "@/components/ui/Toast";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

interface ToastContextType {
  addToast: (
    type: ToastType,
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      options?: { autoClose?: boolean; duration?: number }
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        id,
        type,
        title,
        message,
        autoClose: options?.autoClose !== false,
        duration: options?.duration || 4000,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Map Toast to ToastProps by adding the onClose callback
  const toastProps = toasts.map((toast) => ({
    ...toast,
    onClose: removeToast,
  }));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer
        toasts={toastProps}
        onClose={removeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
