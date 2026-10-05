/**
 * Best-effort per-IP limiter for the AI route.
 *
 * State lives in server memory, so on serverless hosts each warm instance
 * keeps its own counts. That is good enough to stop one visitor from draining
 * the shared free-tier Gemini quota; Google's own 429s are the real backstop.
 */

const PER_MINUTE = 5;
const PER_DAY = 30;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

interface Bucket {
  minuteStart: number;
  minuteCount: number;
  dayStart: number;
  dayCount: number;
}

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: 'busy' | 'daily_limit'; retryAfterSeconds: number };

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  // Keep memory bounded if the instance lives a long time
  if (buckets.size > 5000) buckets.clear();

  const bucket = buckets.get(key) ?? { minuteStart: now, minuteCount: 0, dayStart: now, dayCount: 0 };
  if (now - bucket.minuteStart >= MINUTE_MS) {
    bucket.minuteStart = now;
    bucket.minuteCount = 0;
  }
  if (now - bucket.dayStart >= DAY_MS) {
    bucket.dayStart = now;
    bucket.dayCount = 0;
  }

  if (bucket.dayCount >= PER_DAY) {
    buckets.set(key, bucket);
    return { allowed: false, reason: 'daily_limit', retryAfterSeconds: Math.ceil((bucket.dayStart + DAY_MS - now) / 1000) };
  }
  if (bucket.minuteCount >= PER_MINUTE) {
    buckets.set(key, bucket);
    return { allowed: false, reason: 'busy', retryAfterSeconds: Math.ceil((bucket.minuteStart + MINUTE_MS - now) / 1000) };
  }

  bucket.minuteCount += 1;
  bucket.dayCount += 1;
  buckets.set(key, bucket);
  return { allowed: true };
}
