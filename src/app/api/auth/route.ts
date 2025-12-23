import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  clearAdminCookie,
  createAdminSessionToken,
  getAdminFromDB,
  setAdminCookie,
  verifyAdminSessionToken,
} from '@/lib/auth';
import * as adminService from '@/lib/services/adminService';
import { checkRateLimit } from '@/lib/rateLimit';
import { generateCsrfToken, clearCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError, UnauthorizedError } from '@/lib/errors';

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

  try {
    const { sessionSecret } = await getAdminFromDB();
    const payload = verifyAdminSessionToken(sessionSecret, token);
    return NextResponse.json({ authenticated: Boolean(payload) }, { status: 200 });
  } catch {
    // Database or env missing => treat as not authenticated
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await checkRateLimit(request, 'auth:login', { windowMs: 60_000, max: 10 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid credentials');
    }

    const { username, password } = parsed.data;

    // Verify credentials from database
    const isValid = await adminService.verifyAdmin(username, password);
    if (isValid) {
      const { sessionSecret } = await getAdminFromDB();
      const token = createAdminSessionToken(sessionSecret);
      const response = NextResponse.json({ success: true });
      setAdminCookie(response, token);
      // Generate CSRF token for authenticated sessions
      await generateCsrfToken(response, request);
      return response;
    }

    throw new UnauthorizedError('Invalid credentials');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminCookie(response);
  clearCsrfToken(response);
  return response;
}
