'use client';

import { useEffect, useCallback } from 'react';
import { Toast } from '@/types';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl max-w-sm text-sm font-medium border backdrop-blur-md pointer-events-auto shadow-lg transition-all ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
          : 'bg-red-950/90 border-red-500/30 text-red-300'
      }`}
      role="alert"
      aria-live="polite"
      data-testid={`toast-${toast.type}`}
    >
      {isSuccess ? <CheckIcon /> : <ErrorIcon />}
      <span className="flex-1">{toast.message}</span>
      <button
        className="opacity-60 hover:opacity-100 transition-opacity flex items-center shrink-0 cursor-pointer text-current bg-transparent border-none"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        data-testid="toast-close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const handleDismiss = useCallback(
    (id: string) => {
      onDismiss(id);
    },
    [onDismiss]
  );

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none"
      aria-label="Notifications"
      data-testid="toast-container"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
