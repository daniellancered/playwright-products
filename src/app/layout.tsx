import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Manager | Playwright Playground',
  description:
    'A full-featured product management app built with Next.js App Router — ready for Playwright end-to-end testing.',
  keywords: ['playwright', 'next.js', 'product management', 'testing'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
