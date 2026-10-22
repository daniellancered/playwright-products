'use client';

import { useState, useEffect } from 'react';
import { Product, ProductInput } from '@/types';

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

interface FormState {
  title: string;
  price: string;
  quantity: string;
}

interface FormErrors {
  title?: string;
  price?: string;
  quantity?: string;
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

const inputBase =
  'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';
const inputError = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';

export default function ProductFormModal({
  product,
  onClose,
  onSuccess,
  onError,
  onRefresh,
}: ProductFormModalProps) {
  const isEditing = Boolean(product);

  const [form, setForm] = useState<FormState>({
    title: product?.title ?? '',
    price: product?.price !== undefined ? String(product.price) : '',
    quantity: product?.quantity !== undefined ? String(product.quantity) : '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    const price = parseFloat(form.price);
    if (form.price === '' || isNaN(price) || price < 0) {
      newErrors.price = 'Price must be a valid non-negative number';
    }
    const qty = parseInt(form.quantity, 10);
    if (form.quantity === '' || isNaN(qty) || qty < 0) {
      newErrors.quantity = 'Quantity must be a valid non-negative integer';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: ProductInput = {
        title: form.title.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      };

      const url = isEditing ? `/api/products/${product!.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong');
      }

      onSuccess(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      onRefresh();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      data-testid="product-form-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl shadow-black/80 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-xl font-bold tracking-tight text-slate-100">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
          data-testid="product-form"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
              htmlFor="product-title"
            >
              Product Title
            </label>
            <input
              id="product-title"
              type="text"
              className={`${inputBase} ${errors.title ? inputError : ''}`}
              placeholder='e.g. MacBook Pro 14"'
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              data-testid="input-title"
              autoFocus
              autoComplete="off"
            />
            {errors.title && (
              <span className="text-xs text-red-400" role="alert" data-testid="error-title">
                {errors.title}
              </span>
            )}
          </div>

          {/* Price + Quantity row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                htmlFor="product-price"
              >
                Price ($)
              </label>
              <input
                id="product-price"
                type="number"
                className={`${inputBase} ${errors.price ? inputError : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                data-testid="input-price"
              />
              {errors.price && (
                <span className="text-xs text-red-400" role="alert" data-testid="error-price">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                htmlFor="product-quantity"
              >
                Quantity
              </label>
              <input
                id="product-quantity"
                type="number"
                className={`${inputBase} ${errors.quantity ? inputError : ''}`}
                placeholder="0"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                data-testid="input-quantity"
              />
              {errors.quantity && (
                <span className="text-xs text-red-400" role="alert" data-testid="error-quantity">
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              data-testid="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
              data-testid="btn-submit"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
              ) : isEditing ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
