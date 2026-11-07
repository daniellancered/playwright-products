import type { Metadata } from 'next';
import LoginForm from '@/components/login-preview/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in | ProductManager',
  description: 'Sign in to the ProductManager demo workspace.',
};

export default function LoginPage() {
  return <LoginForm />;
}
