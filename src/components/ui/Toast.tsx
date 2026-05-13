"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, autoClose, duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200";

  const iconColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
        ? "text-red-600"
        : "text-blue-600";

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
        ? AlertCircle
        : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${bgColor} p-4 shadow-lg animate-in slide-in-from-right-4 fade-in duration-300`}
      style={{ fontFamily: "Inter Tight, sans-serif" }}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconColor} mt-0.5`} />
      <div className="flex-1">
        <h3 className={`font-medium ${iconColor}`}>{title}</h3>
        {message && (
          <p className={`mt-1 text-sm ${iconColor}/80`}>{message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`shrink-0 text-gray-400 hover:text-gray-600 transition`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export interface ToastManagerState {
  toasts: ToastProps[];
  addToast: (
    type: ToastType,
    title: string,
    message?: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<{ toasts: ToastProps[]; onClose: (id: string) => void }> = ({
  toasts,
  onClose,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
