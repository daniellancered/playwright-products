'use client';

import { useEffect } from 'react';
import { Product } from '@/types';

interface DeleteConfirmModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

function WarningIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DeleteConfirmModal({
  product,
  onClose,
  onSuccess,
  onError,
  onRefresh,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleDelete() {
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to delete product');
      }

      onSuccess(`"${product.title}" was deleted successfully.`);
      onRefresh();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unexpected error occurred');
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      data-testid="delete-confirm-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl shadow-black/80 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="confirm-title" className="text-xl font-bold tracking-tight text-slate-100">
            Delete Product
          </h2>
          <button
            className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-md bg-transparent border-none cursor-pointer flex items-center"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="modal-close"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-400">
            <WarningIcon />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <strong className="text-slate-100 font-semibold" data-testid="confirm-product-name">
              &quot;{product.title}&quot;
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all"
            onClick={onClose}
            data-testid="btn-cancel-delete"
          >
            Cancel
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-red-500/30 bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 transition-all"
            onClick={handleDelete}
            data-testid="btn-confirm-delete"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
