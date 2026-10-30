export type Product = {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductInput = Pick<Product, 'title' | 'price' | 'quantity'>;

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export type ProductValidationCase = {
  name: string;
  product: Product;
  error: string;
  errorLocator: 'titleError' | 'priceError' | 'quantityError';
};
