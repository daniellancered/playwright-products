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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
      className="modal-backdrop"
      data-testid="delete-confirm-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="modal-header">
          <h2 id="confirm-title" className="modal-title">
            Delete Product
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="modal-close"
          >
            <XIcon />
          </button>
        </div>

        <div className="confirm-body">
          <div className="confirm-icon">
            <WarningIcon />
          </div>
          <p>
            Are you sure you want to delete{' '}
            <strong data-testid="confirm-product-name">&quot;{product.title}&quot;</strong>? This
            action cannot be undone.
          </p>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            data-testid="btn-cancel-delete"
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
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
