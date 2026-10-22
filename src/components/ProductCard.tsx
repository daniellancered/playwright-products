'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M11.5 1.5a1.415 1.415 0 012 2L5 12H3v-2L11.5 1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M2 4h11M5 4V2h5v2M6 7v5M9 7v5M3 4l1 9h7l1-9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const isLowStock = product.quantity < 10;

  return (
    <article
      className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 group"
      data-testid="product-card"
      data-product-id={product.id}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3
          className="text-base font-semibold text-slate-100 leading-snug break-words"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <button
            className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.title}`}
            data-testid="btn-edit"
            title="Edit product"
          >
            <EditIcon />
          </button>
          <button
            className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.title}`}
            data-testid="btn-delete"
            title="Delete product"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3.5 py-2.5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Price
          </div>
          <div className="text-base font-bold text-indigo-400" data-testid="product-price">
            {formatPrice(product.price)}
          </div>
        </div>
        <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3.5 py-2.5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Stock
          </div>
          <div
            className={`text-base font-bold ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}
            data-testid="product-quantity"
          >
            {product.quantity} units
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4" data-testid="product-updated">
        Updated {formatDate(product.updatedAt)}
      </p>
    </article>
  );
}
