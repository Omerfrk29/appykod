import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminFromDB } from './auth';

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * Generate a CSRF token using HMAC-SHA256
 */
function generateToken(secret: string, sessionId: string): string {
  const timestamp = Date.now().toString();
  const data = `${sessionId}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('base64url');
  return `${timestamp}:${signature}`;
}

/**
 * Verify a CSRF token
 */
function verifyToken(secret: string, sessionId: string, token: string): boolean {
  const parts = token.split(':');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const data = `${sessionId}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const expectedSignature = hmac.digest('base64url');

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Get session ID from request (using IP + User-Agent as fallback)
 */
function getSessionId(request: Request): string {
  // Try to get from cookie first (if we set one)
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/(?:^|;\s*)session_id=([^;]+)/);
  if (sessionMatch?.[1]) {
    return sessionMatch[1];
  }

  // Fallback: use IP + User-Agent hash
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const combined = `${ip}:${userAgent}`;
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

/**
 * Generate and set CSRF token in cookie
 */
export async function generateCsrfToken(response: NextResponse, request: Request): Promise<string> {
  try {
    const { sessionSecret } = await getAdminFromDB();
    const sessionId = getSessionId(request);
    const token = generateToken(sessionSecret, sessionId);

    response.cookies.set(CSRF_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CSRF_TOKEN_MAX_AGE,
    });

    return token;
  } catch {
    // If admin config is missing, generate a temporary token
    const sessionId = getSessionId(request);
    const tempSecret = process.env.ADMIN_SESSION_SECRET || 'temp-secret';
    const token = generateToken(tempSecret, sessionId);

    response.cookies.set(CSRF_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CSRF_TOKEN_MAX_AGE,
    });

    return token;
  }
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: Request): Promise<boolean> {
  // Safe methods don't need CSRF protection
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  if (!headerToken) {
    return false;
  }

  // Get token from cookie
  const cookies = request.headers.get('cookie') || '';
  const cookieMatch = cookies.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  const cookieToken = cookieMatch?.[1];

  if (!cookieToken) {
    return false;
  }

  // Tokens must match (Double Submit Cookie pattern)
  if (headerToken !== cookieToken) {
    return false;
  }

  // Verify token signature
  try {
    const { sessionSecret } = await getAdminFromDB();
    const sessionId = getSessionId(request);
    return verifyToken(sessionSecret, sessionId, headerToken);
  } catch {
    // Fallback to temp secret
    const tempSecret = process.env.ADMIN_SESSION_SECRET || 'temp-secret';
    const sessionId = getSessionId(request);
    return verifyToken(tempSecret, sessionId, headerToken);
  }
}

/**
 * Clear CSRF token cookie
 */
export function clearCsrfToken(response: NextResponse): void {
  response.cookies.set(CSRF_TOKEN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Check CSRF token and throw ForbiddenError if invalid
 * Use this in API endpoints for better error handling
 */
export async function requireCsrfToken(request: Request): Promise<void> {
  const isValid = await verifyCsrfToken(request);
  if (!isValid) {
    const { ForbiddenError } = await import('./errors');
    throw new ForbiddenError('Invalid or missing CSRF token');
  }
}

