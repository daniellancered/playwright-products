'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product, Toast } from '@/types';
import ToastContainer from '@/components/ToastContainer';
import ProductCard from '@/components/ProductCard';
import ProductFormModal from '@/components/ProductFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 2L2 9l14 7 14-7-14-7zM2 23l14 7 14-7M2 16l14 7 14-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="8" height="8" rx="2" fill="white" opacity="0.9" />
      <rect x="12" y="2" width="8" height="8" rx="2" fill="white" opacity="0.6" />
      <rect x="2" y="12" width="8" height="8" rx="2" fill="white" opacity="0.6" />
      <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.3" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div className="skeleton-line" style={{ width: '60%', height: '1.125rem' }} />
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <div className="skeleton-line" style={{ width: '2rem', height: '2rem', borderRadius: '6px' }} />
          <div className="skeleton-line" style={{ width: '2rem', height: '2rem', borderRadius: '6px' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton-line" style={{ width: '40%', height: '0.75rem', marginBottom: '0.5rem' }} />
          <div className="skeleton-line" style={{ width: '70%', height: '1.25rem' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="skeleton-line" style={{ width: '40%', height: '0.75rem', marginBottom: '0.5rem' }} />
          <div className="skeleton-line" style={{ width: '70%', height: '1.25rem' }} />
        </div>
      </div>
      <div className="skeleton-line" style={{ width: '50%', height: '0.75rem' }} />
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data);
    } catch {
      addToast('error', 'Failed to load products. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSuccess = useCallback(
    (message: string) => addToast('success', message),
    [addToast]
  );

  const handleError = useCallback(
    (message: string) => addToast('error', message),
    [addToast]
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <div className="app-logo-icon">
              <LogoIcon />
            </div>
            <div>
              <div className="app-title">ProductManager</div>
              <div className="app-subtitle">Playwright Playground</div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            data-testid="btn-add-product"
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="main-content" id="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Your <span>Products</span>
            </h1>
            <p className="product-count" data-testid="product-count">
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="skeleton-grid" data-testid="loading-state">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state" data-testid="empty-state">
            <div className="empty-icon">
              <BoxIcon />
            </div>
            <h3>No products yet</h3>
            <p>Add your first product to get started. It&apos;ll appear here right away.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
              data-testid="btn-add-first"
            >
              <PlusIcon />
              Add your first product
            </button>
          </div>
        ) : (
          <div className="product-grid" data-testid="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
                onDelete={setDeletingProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <ProductFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          onError={handleError}
          onRefresh={fetchProducts}
        />
      )}

      {editingProduct && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleSuccess}
          onError={handleError}
          onRefresh={fetchProducts}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onSuccess={handleSuccess}
          onError={handleError}
          onRefresh={fetchProducts}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
