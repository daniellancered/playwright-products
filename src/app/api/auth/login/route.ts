import { cookies } from 'next/headers';
import { getDemoCredentials } from '@/lib/auth-config';
import {
  createSessionToken,
  REMEMBERED_SESSION_TTL_SECONDS,
  SESSION_TTL_SECONDS,
  sessionCookie,
} from '@/lib/auth';

export async function POST(request: Request) {
  let demoCredentials: ReturnType<typeof getDemoCredentials>;
  try {
    demoCredentials = getDemoCredentials();
  } catch {
    return Response.json({ message: 'Sign-in is not configured on this server.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Send a valid JSON request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('email' in body) || !('password' in body)) {
    return Response.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  const { email, password, remember } = body as {
    email: unknown;
    password: unknown;
    remember?: unknown;
  };
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim().toLowerCase() !== demoCredentials.email ||
    password !== demoCredentials.password
  ) {
    return Response.json({ message: 'Email or password is incorrect.' }, { status: 401 });
  }

  const maxAge = remember === true ? REMEMBERED_SESSION_TTL_SECONDS : SESSION_TTL_SECONDS;
  const cookieStore = await cookies();
  try {
    cookieStore.set(sessionCookie.name, createSessionToken(demoCredentials.email, maxAge), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge,
    });
  } catch {
    return Response.json({ message: 'Sign-in is not configured on this server.' }, { status: 503 });
  }

  return Response.json({ success: true });
}
