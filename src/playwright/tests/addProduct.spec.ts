import { expect, test } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

test('Add Product', async ({ page }) => {
  const productPage = new ProductPage(page);

  const productData = {
    title: `Product bella`,
    price: 43,
    quantity: 3,
  };

  await productPage.goto();

  // Capture the initial product count.
  const initialCount = await productPage.getProductCount();

  // Add product.
  await productPage.addProduct(productData);

  // Verify the created product's details and success notification.
  await productPage.expectProductDetails(productData);
  await expect(productPage.successToast).toBeVisible();

  // Verify the total product count increased by one.
  await expect.poll(() => productPage.getProductCount()).toBe(initialCount + 1);
});
