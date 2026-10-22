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
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">{children}</body>
    </html>
  );
}
