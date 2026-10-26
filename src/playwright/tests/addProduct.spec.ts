import { test } from '../fixtures/fixtures';
import { createProductData } from '../test-data/productData';

test('Add Product', async ({ productPage }) => {
  const productData = createProductData({ invalid: false });
  if (typeof productData === 'object' && !Array.isArray(productData)) {
    // Add product.
    await productPage.addProduct(productData);

    // Verify the created product's details and success notification.
    await productPage.expectProductDetails(productData);
    await productPage.expectSuccessToast();
  }
});
