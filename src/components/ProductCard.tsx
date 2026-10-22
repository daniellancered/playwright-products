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
      className="product-card"
      data-testid="product-card"
      data-product-id={product.id}
    >
      <div className="product-card-header">
        <h3 className="product-title" data-testid="product-title">
          {product.title}
        </h3>
        <div className="product-actions">
          <button
            className="btn btn-icon product-edit-btn"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.title}`}
            data-testid="btn-edit"
            title="Edit product"
          >
            <EditIcon />
          </button>
          <button
            className="btn btn-icon product-delete-btn"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.title}`}
            data-testid="btn-delete"
            title="Delete product"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="product-stats">
        <div className="product-stat">
          <div className="product-stat-label">Price</div>
          <div className="product-stat-value price" data-testid="product-price">
            {formatPrice(product.price)}
          </div>
        </div>
        <div className="product-stat">
          <div className="product-stat-label">Stock</div>
          <div
            className={`product-stat-value ${isLowStock ? 'qty-low' : 'qty-good'}`}
            data-testid="product-quantity"
          >
            {product.quantity} units
          </div>
        </div>
      </div>

      <p className="product-date" data-testid="product-updated">
        Updated {formatDate(product.updatedAt)}
      </p>
    </article>
  );
}
