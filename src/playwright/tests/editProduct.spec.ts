import { expect, test } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

test('Edit Existing Product', async ({ page }) => {
  const productPage = new ProductPage(page);

  const originalproduct = `product 1`;

  const updatedproduct = {
    title: `edited now ${Date.now()}`,
    price: 145,
    quantity: 50,
  };

  await productPage.goto();

  // Edit existing product.
  await productPage.editProduct(originalproduct, updatedproduct);

  // Verify the edited product's details and success notification.
  await productPage.expectProductDetails(updatedproduct);
  await expect(productPage.successToast).toBeVisible();

  // Verify the old product title no longer exists.
  await expect(productPage.productCard(originalproduct)).toHaveCount(0);
});
