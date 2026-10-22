export interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Pick<Product, 'title' | 'price' | 'quantity'>;

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
