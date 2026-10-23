import type { Locator, Page } from '@playwright/test';

interface ProductFormValues {
  title: string;
  price: number;
  quantity: number;
}

export default class ProductPage {
  readonly page: Page;
  readonly addProductButton: Locator;
  readonly productFormModal: Locator;
  readonly titleInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProductButton = page.getByTestId('btn-add-product');
    this.productFormModal = page.getByTestId('product-form-modal');
    this.titleInput = page.getByTestId('input-title');
    this.priceInput = page.getByTestId('input-price');
    this.quantityInput = page.getByTestId('input-quantity');
    this.submitButton = page.getByTestId('btn-submit');
    this.successToast = page.getByTestId('toast-success');
  }

  async goto() {
    await this.page.goto('');
  }

  async openAddProductForm() {
    await this.addProductButton.click();
  }

  async fillProductForm({ title, price, quantity }: ProductFormValues): Promise<void> {
    await this.titleInput.fill(title);
    await this.priceInput.fill(String(price));
    await this.quantityInput.fill(String(quantity));
  }

  async submitProductForm() {
    await this.submitButton.click();
  }

  // Locate a specific product and its displayed details.
  productCard(title: string): Locator {
    return this.page.getByTestId('product-card').filter({ hasText: title });
  }

  productPrice(title: string): Locator {
    return this.productCard(title).getByTestId('product-price');
  }

  productQuantity(title: string): Locator {
    return this.productCard(title).getByTestId('product-quantity');
  }
}
