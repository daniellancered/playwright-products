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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between mb-5">
        <div className="animate-pulse bg-slate-800 rounded h-5 w-3/5" />
        <div className="flex gap-1.5">
          <div className="animate-pulse bg-slate-800 rounded-md w-8 h-8" />
          <div className="animate-pulse bg-slate-800 rounded-md w-8 h-8" />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="animate-pulse bg-slate-800 rounded h-3 w-2/5 mb-2" />
          <div className="animate-pulse bg-slate-800 rounded h-6 w-3/4" />
        </div>
        <div className="flex-1">
          <div className="animate-pulse bg-slate-800 rounded h-3 w-2/5 mb-2" />
          <div className="animate-pulse bg-slate-800 rounded h-6 w-3/4" />
        </div>
      </div>
      <div className="animate-pulse bg-slate-800 rounded h-3 w-1/2" />
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

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSuccess = useCallback((message: string) => addToast('success', message), [addToast]);

  const handleError = useCallback((message: string) => addToast('error', message), [addToast]);

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
  }, [addToast]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!ignore) {
          setProducts(data);
        }
      } catch {
        if (!ignore) {
          addToast('error', 'Failed to load products. Please refresh.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [addToast]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LogoIcon />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-100 leading-none">
                ProductManager
              </div>
              <div className="text-xs text-slate-400 font-normal mt-1 hidden sm:block">
                Playwright Playground
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
            data-testid="btn-add-product"
          >
            <PlusIcon />
            Add Product
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8" id="main-content">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-sm text-slate-400 font-normal mt-1" data-testid="product-count">
              {loading
                ? 'Loading...'
                : `${products.length} product${products.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-testid="loading-state"
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            className="text-center py-20 flex flex-col items-center gap-4"
            data-testid="empty-state"
          >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-2">
              <BoxIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-100">No products yet</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Add your first product to get started. It&apos;ll appear here right away.
            </p>
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              onClick={() => setShowAddModal(true)}
              data-testid="btn-add-first"
            >
              <PlusIcon />
              Add your first product
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-testid="product-list"
          >
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
