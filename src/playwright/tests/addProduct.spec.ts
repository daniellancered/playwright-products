import { expect, test } from '@playwright/test';
import ProductPage from '@/playwright/pages/productPage';

test('Add Product', async ({ page }) => {
  const title = `Playwright Product ${Date.now()}`;
  const productPage = new ProductPage(page);

  // Open the product form and enter product details.
  await productPage.goto();
  await productPage.openAddProductForm();
  await expect(productPage.productFormModal).toBeVisible();

  await productPage.fillProductForm({
    title,
    price: 29.99,
    quantity: 5,
  });

  // Listen for the creation API response before submitting the form.
  const createResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());

    return url.pathname === '/api/products' && response.request().method() === 'POST';
  });

  await productPage.submitProductForm();

  const createResponse = await createResponsePromise;
  expect(createResponse.status()).toBe(201);

  // Verify the created product's details and success notification.
  await expect(productPage.productCard(title)).toBeVisible();
  await expect(productPage.productPrice(title)).toHaveText('$29.99');
  await expect(productPage.productQuantity(title)).toHaveText('5 units');
  await expect(productPage.successToast).toContainText('Product added successfully!');
});
