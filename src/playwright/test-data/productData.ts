import { Product, ProductValidationCase } from '@/types';

const validProductTemplate: Product = {
  title: `Product ${Date.now()}`,
  price: 100.0,
  quantity: 10,
};

export function createValidProduct(): Product {
  return validProductTemplate;
}

export function getInvalidProductValidationCases(): ProductValidationCase[] {
  return [
    {
      name: 'requires a title',
      product: { ...validProductTemplate, title: '' },
      error: 'Title is required',
      errorLocator: 'titleError',
    },
    {
      name: 'rejects a negative price',
      product: { ...validProductTemplate, price: -1 },
      error: 'Price must be a valid non-negative number',
      errorLocator: 'priceError',
    },
    {
      name: 'rejects a negative quantity',
      product: { ...validProductTemplate, quantity: -1 },
      error: 'Quantity must be a valid non-negative integer',
      errorLocator: 'quantityError',
    },
  ];
}
