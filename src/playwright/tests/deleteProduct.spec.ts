import { expect, test } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

test('Delete Product', async ({ page }) => {
  const productPage = new ProductPage(page);

  const productTitle = 'Playwright Product z 1792719519071';

  await productPage.goto();

  // Verify the existing product is visible.
  await expect(productPage.productCard(productTitle)).toBeVisible();

  // Delete the product.
  await productPage.deleteProduct(productTitle);

  // Verify the product no longer exists.
  await expect(productPage.productCard(productTitle)).toHaveCount(0);
});
