import { type Locator, type Page } from '@playwright/test';

interface ProductFormValues {
  title: string;
  price: number;
  quantity: number;
}

export default class ProductPage {
  readonly page: Page;
  readonly addProductButton: Locator;
  readonly firstAddButton: Locator;
  readonly editProductButton: Locator;
  readonly productFormModal: Locator;
  readonly deleteProductButton: Locator;
  readonly deleteConfirmModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly titleInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;
  readonly successToast: Locator;
  readonly titleError: Locator;
  readonly priceError: Locator;
  readonly quantityError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProductButton = page.getByTestId('btn-add-product');
    this.firstAddButton = page.getByTestId('btn-add-first');
    this.editProductButton = page.getByTestId('btn-edit');
    this.productFormModal = page.getByTestId('product-form-modal');
    this.deleteProductButton = page.getByTestId('btn-delete');
    this.deleteConfirmModal = page.getByTestId('delete-confirm-modal');
    this.confirmDeleteButton = page.getByTestId('btn-confirm-delete');
    this.titleInput = page.getByTestId('input-title');
    this.priceInput = page.getByTestId('input-price');
    this.quantityInput = page.getByTestId('input-quantity');
    this.submitButton = page.getByTestId('btn-submit');
    this.successToast = page.getByTestId('toast-success');
    this.titleError = page.getByTestId('error-title');
    this.priceError = page.getByTestId('error-price');
    this.quantityError = page.getByTestId('error-quantity');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openAddProductForm(): Promise<void> {
    if (await this.firstAddButton.isVisible()) {
      await this.firstAddButton.click();
    } else {
      await this.addProductButton.click();
    }
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
    return this.page.getByTestId('product-card').filter({
      has: this.page.getByTestId('product-title').getByText(title, { exact: true }),
    });
  }

  productPrice(title: string): Locator {
    return this.productCard(title).getByTestId('product-price');
  }

  productQuantity(title: string): Locator {
    return this.productCard(title).getByTestId('product-quantity');
  }

  // Add product workflow
  async addProduct(data: ProductFormValues): Promise<void> {
    await this.openAddProductForm();
    await this.fillProductForm(data);
    await this.submitProductForm();
  }

  // Edit product workflow
  async openEditProductForm(title: string): Promise<void> {
    await this.productCard(title).getByTestId('btn-edit').click();
  }

  async editProduct(currentTitle: string, updatedData: ProductFormValues): Promise<void> {
    await this.openEditProductForm(currentTitle);
    await this.fillProductForm(updatedData);
    await this.submitProductForm();
  }

  // Delete product workflow
  async deleteProduct(title: string): Promise<void> {
    await this.productCard(title).getByTestId('btn-delete').click();
    await this.confirmDeleteButton.click();
  }

  // Count the displayed product cards.
  async getProductCount(): Promise<number> {
    return await this.page.getByTestId('product-card').count();
  }
}
