import fs from 'fs/promises';
import path from 'path';
import { Product, ProductInput } from '@/types';
import { randomUUID } from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'products.json');

async function readProducts(): Promise<Product[]> {
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content) as Product[];
  } catch {
    return [];
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export async function getAllProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await readProducts();
  const now = new Date().toISOString();
  const product: Product = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeProducts(filtered);
  return true;
}
