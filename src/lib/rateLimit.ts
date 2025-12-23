import type { NextRequest } from 'next/server';
import { RateLimitError } from './errors';

// Optional Redis type (only used if ioredis is installed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Redis = any;

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type Entry = {
  resetAt: number;
  count: number;
};

// In-memory fallback
const buckets = new Map<string, Entry>();

// Redis client (lazy initialization)
let redisClient: Redis | null = null;
let redisEnabled = false;

/**
 * Initialize Redis client
 */
async function getRedisClient(): Promise<Redis | null> {
  if (redisClient !== null) {
    return redisClient;
  }

  // Check if ioredis is available
  try {
    await import('ioredis');
  } catch {
    // ioredis not installed, use in-memory fallback
    redisEnabled = false;
    return null;
  }

  const redisUrl = process.env.REDIS_URL;
  const redisEnabledEnv = process.env.REDIS_ENABLED;

  // Check if Redis is explicitly disabled
  if (redisEnabledEnv === 'false') {
    redisEnabled = false;
    return null;
  }

  // If REDIS_URL is not set, use in-memory fallback
  if (!redisUrl) {
    redisEnabled = false;
    return null;
  }

  try {
    const RedisClass = (await import('ioredis')).default;
    redisClient = new RedisClass(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
      },
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    redisClient.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err);
      // Fallback to in-memory on error
      redisEnabled = false;
    });

    redisClient.on('connect', () => {
      redisEnabled = true;
      console.log('[Redis] Connected successfully');
    });

    // Attempt to connect (non-blocking)
    redisClient.connect().catch(() => {
      // Silent fail, will use in-memory fallback
      redisEnabled = false;
    });

    return redisClient;
  } catch (error) {
    console.error('[Redis] Failed to initialize:', error);
    redisEnabled = false;
    return null;
  }
}

function getClientIp(req: Request | NextRequest): string {
  // Best-effort: works behind most proxies/CDNs; for local dev falls back to empty.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? '';
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '';
}

/**
 * Rate limit using Redis (sliding window algorithm)
 */
async function rateLimitRedis(
  key: string,
  opts: RateLimitOptions
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const client = await getRedisClient();
  if (!client || !redisEnabled) {
    // Fallback to in-memory
    return rateLimitMemory(key, opts);
  }

  try {
    const now = Date.now();
    const windowStart = now - opts.windowMs;
    const windowKey = `ratelimit:${key}`;

    // Use Redis pipeline for atomic operations
    const pipeline = client.pipeline();
    
    // Remove old entries (outside the window)
    pipeline.zremrangebyscore(windowKey, 0, windowStart);
    
    // Count current entries in window
    pipeline.zcard(windowKey);
    
    // Add current request timestamp
    pipeline.zadd(windowKey, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(windowKey, Math.ceil(opts.windowMs / 1000));
    
    const results = await pipeline.exec();
    
    if (!results) {
      // Pipeline failed, fallback to in-memory
      return rateLimitMemory(key, opts);
    }

    const count = results[1]?.[1] as number | undefined;
    if (count === undefined) {
      return rateLimitMemory(key, opts);
    }

    // Check if limit exceeded (before adding current request)
    if (count >= opts.max) {
      // Get oldest entry to calculate retry time
      const oldest = await client.zrange(windowKey, 0, 0, 'WITHSCORES');
      if (oldest.length > 0) {
        const oldestTime = parseInt(oldest[1] as string, 10);
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((oldestTime + opts.windowMs - now) / 1000)
        );
        return { ok: false, retryAfterSeconds };
      }
      return { ok: false, retryAfterSeconds: Math.ceil(opts.windowMs / 1000) };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Redis] Rate limit error:', error);
    // Fallback to in-memory on error
    return rateLimitMemory(key, opts);
  }
}

/**
 * Rate limit using in-memory storage (fallback)
 */
function rateLimitMemory(
  key: string,
  opts: RateLimitOptions
): { ok: true } | { ok: false; retryAfterSeconds: number } {
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

/**
 * Rate limit function (supports both Redis and in-memory)
 */
export async function rateLimit(
  req: Request | NextRequest,
  keyPrefix: string,
  opts: RateLimitOptions
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const ip = getClientIp(req);
  const key = `${keyPrefix}:${ip || 'unknown'}`;

  // Try Redis first, fallback to in-memory
  return rateLimitRedis(key, opts);
}

/**
 * Rate limit check that throws RateLimitError if limit exceeded
 * Use this version when using centralized error handling
 */
export async function checkRateLimit(
  req: Request | NextRequest,
  keyPrefix: string,
  opts: RateLimitOptions
): Promise<void> {
  const result = await rateLimit(req, keyPrefix, opts);
  if (!result.ok) {
    throw new RateLimitError('Too many requests', result.retryAfterSeconds);
  }
}


