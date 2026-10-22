# 🎭 playwright-products

A **Next.js 16 App Router** product management app built as a **Playwright testing playground**.

## ✨ Features

- 📦 **Add products** — title, price, quantity
- ✏️ **Edit products** — inline modal form
- 🗑️ **Delete products** — confirmation dialog
- 🔔 **Toast notifications** — success & error messages
- 💾 **JSON file storage** — no database required
- 🎯 **Playwright-ready** — `data-testid` attributes on every interactive element
- 🌙 **Dark mode UI** — premium glassmorphism design

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Vanilla CSS (custom design system)
- **Data**: JSON flat file (`data/products.json`)
- **Linting**: ESLint + Prettier

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

| Method   | Route               | Description       |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/products`     | List all products |
| `POST`   | `/api/products`     | Create a product  |
| `PUT`    | `/api/products/:id` | Update a product  |
| `DELETE` | `/api/products/:id` | Delete a product  |

## 🎭 Playwright Testing

Key `data-testid` selectors available:

| Selector               | Element                     |
| ---------------------- | --------------------------- |
| `btn-add-product`      | Header "Add Product" button |
| `product-list`         | Product grid container      |
| `product-card`         | Individual product card     |
| `product-title`        | Product title text          |
| `product-price`        | Product price text          |
| `product-quantity`     | Product quantity text       |
| `btn-edit`             | Edit button on card         |
| `btn-delete`           | Delete button on card       |
| `product-form-modal`   | Add/edit modal backdrop     |
| `product-form`         | The form element            |
| `input-title`          | Title input                 |
| `input-price`          | Price input                 |
| `input-quantity`       | Quantity input              |
| `btn-submit`           | Form submit button          |
| `btn-cancel`           | Form cancel button          |
| `delete-confirm-modal` | Delete confirmation modal   |
| `btn-confirm-delete`   | Confirm delete button       |
| `btn-cancel-delete`    | Cancel delete button        |
| `toast-container`      | Toast notifications area    |
| `toast-success`        | Success toast               |
| `toast-error`          | Error toast                 |
| `empty-state`          | Empty state (no products)   |

## 📝 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check Prettier formatting
```
