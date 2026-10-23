import { expect, test } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

test('Add Product', async ({ page }) => {
  const productPage = new ProductPage(page);

  const productData = {
    title: `Product z ${Date.now()}`,
    price: 20,
    quantity: 1,
  };

  // Add product.
  await productPage.goto();
  await productPage.addProduct(productData);

  // Verify the created product's details and success notification.
  await productPage.expectProductDetails(productData);
  await expect(productPage.successToast).toBeVisible();
});
