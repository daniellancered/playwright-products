export function createProductData({ invalid = false }: { invalid?: boolean } = {}) {
  const validProduct = {
    title: `product ${Date.now()}`,
    price: 100,
    quantity: 3,
  };

  if (invalid) {
    return [
      {
        name: 'requires a title',
        product: { ...validProduct, title: '' },
        error: 'Title is required',
        errorLocator: 'titleError' as const,
      },
      {
        name: 'rejects a negative price',
        product: { ...validProduct, price: -1 },
        error: 'Price must be a valid non-negative number',
        errorLocator: 'priceError' as const,
      },
      {
        name: 'rejects a negative quantity',
        product: { ...validProduct, quantity: -1 },
        error: 'Quantity must be a valid non-negative integer',
        errorLocator: 'quantityError' as const,
      },
    ];
  } else {
    return validProduct;
  }
}
