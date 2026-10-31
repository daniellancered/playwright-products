import { expect, test } from '../fixtures/fixtures';

test('Edit Existing Product Title', async ({ productPage, existingProduct }) => {
  const id = Date.now();
  const updatedProduct = { ...existingProduct, title: `edited now ${id}` };

  // Edit existing product.
  await productPage.editProduct(existingProduct.title, updatedProduct);

  // Verify the edited product's details and success notification.
  await expect(productPage.productCard(updatedProduct.title)).toBeVisible();
  await expect(productPage.productPrice(updatedProduct.title)).toHaveText(
    `$${updatedProduct.price.toFixed(2)}`
  );
  await expect(productPage.productQuantity(updatedProduct.title)).toHaveText(
    `${updatedProduct.quantity} units`
  );
  await expect(productPage.successToast).toBeVisible();

  // Verify the old product title no longer exists.
  await expect(productPage.productCard(existingProduct.title)).toHaveCount(0);
});
