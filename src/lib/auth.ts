import { NextResponse } from 'next/server';
import crypto from 'crypto';

const COOKIE_NAME = 'auth_token';

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function b64urlDecodeToBuffer(input: string): Buffer {
  const padLen = (4 - (input.length % 4)) % 4;
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  return Buffer.from(padded, 'base64');
}

function hmacSha256(secret: string, data: string): string {
  return b64urlEncode(crypto.createHmac('sha256', secret).update(data).digest());
}

export function getAdminEnv() {
  const user = process.env.ADMIN_USER;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!user || !passwordHash || !sessionSecret) {
    throw new Error(
      'Missing admin env vars. Please set ADMIN_USER, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET.'
    );
  }

  return { user, passwordHash, sessionSecret };
}

type ScryptHash = {
  n: number;
  r: number;
  p: number;
  salt: Buffer;
  hash: Buffer;
};

function parseScryptHash(stored: string): ScryptHash | null {
  // Format: scrypt:N:r:p:saltB64:hashB64 (: delimiter - $ causes issues with env vars)
  const parts = stored.split(':');
  if (parts.length !== 6) return null;
  if (parts[0] !== 'scrypt') return null;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return null;
  const salt = Buffer.from(parts[4], 'base64');
  const hash = Buffer.from(parts[5], 'base64');
  if (!salt.length || !hash.length) return null;
  return { n, r, p, salt, hash };
}

export function verifyPassword(plain: string, storedHash: string): boolean {
  const parsed = parseScryptHash(storedHash);
  if (!parsed) return false;

  const derived = crypto.scryptSync(plain, parsed.salt, parsed.hash.length, {
    N: parsed.n,
    r: parsed.r,
    p: parsed.p,
    maxmem: 128 * 1024 * 1024,
  });

  // timingSafeEqual requires same length
  if (derived.length !== parsed.hash.length) return false;
  return crypto.timingSafeEqual(derived, parsed.hash);
}

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16);
  const n = 16384;
  const r = 8;
  const p = 1;
  const keyLen = 64;
  const hash = crypto.scryptSync(plain, salt, keyLen, { N: n, r, p, maxmem: 128 * 1024 * 1024 });
  return `scrypt:${n}:${r}:${p}:${salt.toString('base64')}:${hash.toString('base64')}`;
}

type AdminSessionPayload = {
  sub: 'admin';
  exp: number; // unix seconds
};

export function createAdminSessionToken(sessionSecret: string, ttlSeconds = 60 * 60 * 24 * 7) {
  const payload: AdminSessionPayload = {
    sub: 'admin',
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = hmacSha256(sessionSecret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionToken(
  sessionSecret: string,
  token: string
): AdminSessionPayload | null {
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;
  const expected = hmacSha256(sessionSecret, payloadB64);
  // avoid timing leaks
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const json = b64urlDecodeToBuffer(payloadB64).toString('utf8');
    const payload = JSON.parse(json) as AdminSessionPayload;
    if (payload?.sub !== 'admin') return null;
    if (typeof payload.exp !== 'number') return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function isAdminRequest(req: Request): boolean {
  const token = req.headers.get('cookie')?.match(/(?:^|;\s*)auth_token=([^;]+)/)?.[1];
  if (!token) return false;
  const { sessionSecret } = getAdminEnv();
  return Boolean(verifyAdminSessionToken(sessionSecret, token));
}

export function requireAdmin(req: Request): NextResponse | null {
  if (isAdminRequest(req)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}


