import { Product, ProductValidationCase } from '@/types';

const baseProduct: Product = {
  title: `Product ${Date.now()}`,
  price: 100.0,
  quantity: 10,
};

export function createValidProductData(): Product {
  return baseProduct;
}

export function createInvalidProductData(): ProductValidationCase[] {
  return [
    {
      name: 'requires a title',
      product: { ...baseProduct, title: '' },
      error: 'Title is required',
      errorLocator: 'titleError',
    },
    {
      name: 'rejects a negative price',
      product: { ...baseProduct, price: -1 },
      error: 'Price must be a valid non-negative number',
      errorLocator: 'priceError',
    },
    {
      name: 'rejects a negative quantity',
      product: { ...baseProduct, quantity: -1 },
      error: 'Quantity must be a valid non-negative integer',
      errorLocator: 'quantityError',
    },
  ];
}
