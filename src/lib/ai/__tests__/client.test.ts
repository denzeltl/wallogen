import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { requestAiWallpaper, describeRetry } from '../client';

describe('client AI requesting & retry description', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('describeRetry formats human-readable durations', () => {
    const now = 1000000;
    expect(describeRetry(undefined, now)).toBeNull();
    expect(describeRetry(now + 30_000, now)).toBe('in about a minute');
    expect(describeRetry(now + 5 * 60_000, now)).toBe('in about 5 minutes');
    expect(describeRetry(now + 60 * 60_000, now)).toBe('in about an hour');
    expect(describeRetry(now + 3 * 3600_000, now)).toBe('in about 3 hours');
  });

  it('requestAiWallpaper returns source "ai" on successful API response', async () => {
    const mockConfig = {
      title: 'Neon Dreams',
      rationale: 'Cyberpunk style',
      patternId: 'stripes',
      palette: { mode: 'dark' as const, background: '#000000', colors: ['#ff007f', '#00f3ff', '#9d00ff'] },
      params: { scale: 1, density: 10, complexity: 5, noiseIntensity: 0.05, rotation: 0 },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true, config: mockConfig }), { status: 200 })
    );

    const result = await requestAiWallpaper('neon city');
    expect(result.source).toBe('ai');
    expect(result.config.title).toBe('Neon Dreams');
    expect(result.notice).toBeUndefined();
  });

  it('requestAiWallpaper sets cooldown and returns fallback on rate limit / quota exhaustion', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(
        JSON.stringify({ ok: false, reason: 'daily_limit', retryAfterSeconds: 3600 }),
        { status: 429 }
      )
    );

    const result = await requestAiWallpaper('northern lights');
    expect(result.source).toBe('fallback');
    expect(result.notice?.kind).toBe('daily_limit');
    expect(result.notice?.retryAt).toBeGreaterThan(Date.now());

    // Subsequent request should skip fetch because of localStorage cooldown
    fetchSpy.mockClear();
    const result2 = await requestAiWallpaper('northern lights');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result2.source).toBe('fallback');
    expect(result2.notice?.kind).toBe('daily_limit');
  });

  it('requestAiWallpaper returns fallback on network error or timeout', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const result = await requestAiWallpaper('peaceful dunes');
    expect(result.source).toBe('fallback');
    expect(result.notice?.kind).toBe('unavailable');
  });
});
