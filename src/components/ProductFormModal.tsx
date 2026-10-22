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

  // Focus trap — close on Escape
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
      className="modal-backdrop"
      data-testid="product-form-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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

        <form className="form" onSubmit={handleSubmit} noValidate data-testid="product-form">
          <div className="form-group">
            <label className="form-label" htmlFor="product-title">
              Product Title
            </label>
            <input
              id="product-title"
              type="text"
              className={`form-input${errors.title ? ' error' : ''}`}
              placeholder="e.g. MacBook Pro 14&quot;"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              data-testid="input-title"
              autoFocus
              autoComplete="off"
            />
            {errors.title && (
              <span className="form-error" role="alert" data-testid="error-title">
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="product-price">
                Price ($)
              </label>
              <input
                id="product-price"
                type="number"
                className={`form-input${errors.price ? ' error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                data-testid="input-price"
              />
              {errors.price && (
                <span className="form-error" role="alert" data-testid="error-price">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-quantity">
                Quantity
              </label>
              <input
                id="product-quantity"
                type="number"
                className={`form-input${errors.quantity ? ' error' : ''}`}
                placeholder="0"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                data-testid="input-quantity"
              />
              {errors.quantity && (
                <span className="form-error" role="alert" data-testid="error-quantity">
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              data-testid="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              data-testid="btn-submit"
            >
              {submitting ? (
                <span className="loading-spinner">
                  <span className="spinner" />
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
