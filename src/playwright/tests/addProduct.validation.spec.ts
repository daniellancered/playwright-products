import { expect, test } from '@/playwright/fixtures/fixtures';
import { getInvalidProductValidationCases } from '../test-data/productData';

// using product data with invalid values to test product form validation
const invalidCases = getInvalidProductValidationCases();

test.describe('Add product form validation', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.openAddProductForm();
    await expect(productPage.productFormModal).toBeVisible();
  });

  for (const { name, product, error, errorLocator } of invalidCases) {
    test(`should show validation error when ${name}`, async ({ productPage }) => {
      const initialProductCount = await productPage.getProductCount();

      await productPage.fillProductForm(product);
      await productPage.submitProductForm();
      await expect(productPage[errorLocator]).toHaveText(error);

      await expect(productPage.productFormModal).toBeVisible();
      await expect.poll(() => productPage.getProductCount()).toBe(initialProductCount);
    });
  }
});
