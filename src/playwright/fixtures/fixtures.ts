import { test as base } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';
import { createValidProductData } from '@/playwright/test-data/productData';
import { Product } from '@/types';

type ProductFixtures = {
  productPage: ProductPage;
  createExistingProduct: Product;
};

export const test = base.extend<ProductFixtures>({
  // Fixture to interact with the ProductPage class.
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await use(productPage);
  },

  createExistingProduct: async ({ productPage }, use) => {
    const product = createValidProductData();
    await productPage.addProduct(product);
    await use(product);
  },
});

export { expect } from '@playwright/test';
