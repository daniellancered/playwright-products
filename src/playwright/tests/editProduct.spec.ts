import { expect, test } from '../fixtures/fixtures';
import { updatedProductTemplate } from '../test-data/productData';

test.describe('Edit Product Details', async () => {
  // Edit product title
  test('should update product title', async ({ productPage, existingProduct }) => {
    const updatedProduct = { ...existingProduct, title: updatedProductTemplate.title };
    await productPage.editProduct(existingProduct.title, updatedProduct);

    await expect(productPage.productCard(updatedProduct.title)).toBeVisible();
    await expect(productPage.successToast).toBeVisible();
  });
  //Edit product price
  test('should update product price', async ({ productPage, existingProduct }) => {
    const updatedProduct = { ...existingProduct, price: updatedProductTemplate.price };
    await productPage.editProduct(existingProduct.title, updatedProduct);

    await expect(productPage.productPrice(updatedProduct.title)).toHaveText(
      `$${updatedProduct.price.toFixed(2)}`
    );
    await expect(productPage.successToast).toBeVisible();
  });

  //Edit product quantity
  test('should update product quantity', async ({ productPage, existingProduct }) => {
    const updatedProduct = { ...existingProduct, quantity: updatedProductTemplate.quantity };
    await productPage.editProduct(existingProduct.title, updatedProduct);
    await expect(productPage.productQuantity(updatedProduct.title)).toHaveText(
      `${updatedProduct.quantity} units`
    );
    await expect(productPage.successToast).toBeVisible();
  });

  //Edit all product details
  test('should update all product details', async ({ productPage, existingProduct }) => {
    const updatedProduct = updatedProductTemplate;

    await productPage.editProduct(existingProduct.title, updatedProduct);

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
});
