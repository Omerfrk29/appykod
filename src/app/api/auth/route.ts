import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  clearAdminCookie,
  createAdminSessionToken,
  getAdminEnv,
  setAdminCookie,
  verifyAdminSessionToken,
  verifyPassword,
} from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

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
    const { sessionSecret } = getAdminEnv();
    const payload = verifyAdminSessionToken(sessionSecret, token);
    return NextResponse.json({ authenticated: Boolean(payload) }, { status: 200 });
  } catch {
    // env missing => treat as not authenticated
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const rl = rateLimit(request, 'auth:login', { windowMs: 60_000, max: 10 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  let env;
  try {
    env = getAdminEnv();
  } catch {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { username, password } = parsed.data;
  const okUser = username === env.user;
  const okPass = verifyPassword(password, env.passwordHash);

  if (!okUser || !okPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminSessionToken(env.sessionSecret);
  const response = NextResponse.json({ success: true });
  setAdminCookie(response, token);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminCookie(response);
  return response;
}
