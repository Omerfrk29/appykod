import type { NextRequest } from 'next/server';

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type Entry = {
  resetAt: number;
  count: number;
};

const buckets = new Map<string, Entry>();

function getClientIp(req: Request | NextRequest): string {
  // Best-effort: works behind most proxies/CDNs; for local dev falls back to empty.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? '';
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '';
}

export function rateLimit(
  req: Request | NextRequest,
  keyPrefix: string,
  opts: RateLimitOptions
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip || 'unknown'}`;
  const now = Date.now();

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { resetAt: now + opts.windowMs, count: 1 });
    return { ok: true };
  }

  if (existing.count >= opts.max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { ok: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { ok: true };
}


