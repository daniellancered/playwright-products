import { test as base } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

type ProductFixtures = {
  productPage: ProductPage;
  existingProduct: { title: string; price: number; quantity: number };
};

export const test = base.extend<ProductFixtures>({
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await use(productPage);
  },

  existingProduct: async ({ productPage }, use) => {
    const product = {
      title: `Test Product for existing`,
      price: 19.99,
      quantity: 1,
    };

    await productPage.goto();
    await productPage.openAddProductForm();
    await productPage.fillProductForm(product);
    await productPage.submitProductForm();

    await use(product);
  },
});

export { expect } from '@playwright/test';
