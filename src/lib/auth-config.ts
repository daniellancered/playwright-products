import 'server-only';

export function getDemoCredentials() {
  const email = process.env.DEMO_LOGIN_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error('DEMO_LOGIN_EMAIL and DEMO_LOGIN_PASSWORD must be configured.');
  }

  return { email, password };
}
