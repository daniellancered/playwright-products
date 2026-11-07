import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'product-manager-session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const REMEMBERED_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  throw new Error('AUTH_SECRET must be configured.');
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function createSessionToken(email: string, maxAge = SESSION_TTL_SECONDS) {
  const expiresAt = Date.now() + maxAge * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token?: string) {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      email?: unknown;
      expiresAt?: unknown;
    };
    if (
      typeof session.email !== 'string' ||
      typeof session.expiresAt !== 'number' ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    return { email: session.email };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: SESSION_COOKIE,
};
