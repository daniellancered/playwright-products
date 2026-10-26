export type ProductData = {
  title: string;
  price: number;
  quantity: number;
};

const baseProduct: ProductData = {
  title: 'Validate Product',
  price: 100,
  quantity: 10,
};

export type ProductValidationCase = {
  name: string;
  product: ProductData;
  error: string;
  errorLocator: 'titleError' | 'priceError' | 'quantityError';
};

export function createValidProductData(): ProductData {
  return { ...baseProduct, title: `Product ${Date.now()}` };
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
