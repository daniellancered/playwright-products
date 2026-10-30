import { expect, test } from '../fixtures/fixtures';
import { createValidProduct } from '../test-data/productData';

test('Add Product', async ({ productPage }) => {
  const productDetails = createValidProduct();

  // Add product.
  await productPage.addProduct(productDetails);

  // Verify the created product's details and success notification.
  await expect(productPage.productCard(productDetails.title)).toBeVisible();
  await expect(productPage.productPrice(productDetails.title)).toHaveText(
    `$${productDetails.price.toFixed(2)}`
  );
  await expect(productPage.productQuantity(productDetails.title)).toHaveText(
    `${productDetails.quantity} units`
  );
  await expect(productPage.successToast).toBeVisible();
});
