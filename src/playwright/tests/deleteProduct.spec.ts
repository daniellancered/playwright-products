import { expect, test } from '@/playwright/fixtures/fixtures';

test('Delete Product', async ({ productPage, existingProduct }) => {
  const productDetails = existingProduct;

  // Verify the existing product is visible.
  await expect(productPage.productCard(productDetails.title)).toBeVisible();

  // Delete the product.
  await productPage.deleteProduct(productDetails.title);

  // Verify the product no longer exists.
  await expect(productPage.productCard(productDetails.title)).toHaveCount(0);
});
