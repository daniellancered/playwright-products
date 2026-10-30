import { test as base } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';
import { createValidProduct } from '@/playwright/test-data/productData';
import { Product } from '@/types';

type ProductFixtures = {
  productPage: ProductPage;
  existingProduct: Product;
};

export const test = base.extend<ProductFixtures>({
  // Fixture to interact with the ProductPage class.
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await use(productPage);
  },
  // Fixture to create an existing product for tests that require it.
  existingProduct: async ({ productPage }, use) => {
    const product = createValidProduct();
    await productPage.addProduct(product);
    await use(product);
  },
});

export { expect } from '@playwright/test';
