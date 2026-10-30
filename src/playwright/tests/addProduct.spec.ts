import { expect, test } from '../fixtures/fixtures';
import { createValidProductData } from '../test-data/productData';

test('Add Product', async ({ productPage }) => {
  const productData = createValidProductData();

  // Add product.
  await productPage.addProduct(productData);

  // Verify the created product's details and success notification.
  await expect(productPage.productCard(productData.title)).toBeVisible();
  await expect(productPage.productPrice(productData.title)).toHaveText(
    `$${productData.price.toFixed(2)}`
  );
  await expect(productPage.productQuantity(productData.title)).toHaveText(
    `${productData.quantity} units`
  );
  await expect(productPage.successToast).toBeVisible();
});
