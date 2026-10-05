import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../rateLimit';

describe('checkRateLimit', () => {
  const ip = '192.168.1.100';

  it('allows up to 5 requests per minute', () => {
    const baseTime = 1000000;
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(ip, baseTime + i * 100);
      expect(res.allowed).toBe(true);
    }

    const sixth = checkRateLimit(ip, baseTime + 600);
    expect(sixth.allowed).toBe(false);
    if (!sixth.allowed) {
      expect(sixth.reason).toBe('busy');
      expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it('resets per-minute bucket after 60 seconds', () => {
    const ip2 = '192.168.1.101';
    const baseTime = 2000000;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip2, baseTime);
    }
    expect(checkRateLimit(ip2, baseTime).allowed).toBe(false);

    // 61 seconds later
    const afterMinute = checkRateLimit(ip2, baseTime + 61_000);
    expect(afterMinute.allowed).toBe(true);
  });

  it('enforces 30 requests per day limit', () => {
    const ip3 = '192.168.1.102';
    let now = 3000000;

    // Simulate 6 bursts of 5 requests spaced 2 minutes apart
    for (let burst = 0; burst < 6; burst++) {
      for (let req = 0; req < 5; req++) {
        const res = checkRateLimit(ip3, now);
        expect(res.allowed).toBe(true);
      }
      now += 120_000; // +2 mins
    }

    // 31st request should hit daily limit
    const res = checkRateLimit(ip3, now);
    expect(res.allowed).toBe(false);
    if (!res.allowed) {
      expect(res.reason).toBe('daily_limit');
      expect(res.retryAfterSeconds).toBeGreaterThan(0);
    }
  });
});
