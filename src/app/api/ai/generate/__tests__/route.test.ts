import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import * as geminiModule from '@/lib/ai/gemini';
import * as groqModule from '@/lib/ai/groq';
import * as rateLimitModule from '@/lib/ai/rateLimit';
import { AiWallpaperConfig } from '@/types';

vi.mock('@/lib/ai/groq', () => ({
  generateWallpaperConfigGroq: vi.fn(),
}));

vi.mock('@/lib/ai/gemini', () => ({
  generateWallpaperConfig: vi.fn(),
  AiGenerationError: class AiGenerationError extends Error {
    constructor(public readonly reason: string, public readonly retryAfterSeconds?: number) {
      super(reason);
    }
  },
}));

describe('POST /api/ai/generate', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GROQ_API_KEY: 'gsk_mock_groq_key' };
    vi.clearAllMocks();
    vi.spyOn(rateLimitModule, 'checkRateLimit').mockReturnValue({ allowed: true });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createReq(body: unknown, headers: Record<string, string> = {}) {
    return new NextRequest('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  }

  it('rejects short prompts (< MIN_PROMPT_LENGTH) with HTTP 400', async () => {
    const res = await POST(createReq({ prompt: 'a' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.reason).toBe('invalid_prompt');
  });

  it('rejects overly long prompts (> MAX_PROMPT_LENGTH) with HTTP 400', async () => {
    const res = await POST(createReq({ prompt: 'a'.repeat(201) }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.reason).toBe('invalid_prompt');
  });

  it('returns 429 with Retry-After header when rate limited', async () => {
    vi.spyOn(rateLimitModule, 'checkRateLimit').mockReturnValueOnce({
      allowed: false,
      reason: 'busy',
      retryAfterSeconds: 45,
    });

    const res = await POST(createReq({ prompt: 'calm ocean waves' }));
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('45');
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.reason).toBe('busy');
  });

  it('returns 200 with valid config on successful generation', async () => {
    const sampleConfig: AiWallpaperConfig = {
      title: 'Ocean Sunset',
      rationale: 'Calm waves at dusk',
      patternId: 'waves',
      palette: { mode: 'dark', background: '#0a0a1a', colors: ['#ff5e62', '#ff9966', '#00c6ff'] },
      params: { scale: 1, density: 8, complexity: 4, noiseIntensity: 0.05, rotation: 0 },
    };

    vi.mocked(groqModule.generateWallpaperConfigGroq).mockResolvedValueOnce(sampleConfig);
    vi.mocked(geminiModule.generateWallpaperConfig).mockResolvedValueOnce(sampleConfig);

    const res = await POST(createReq({ prompt: 'calm ocean waves at sunset' }));
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.config.title).toBe('Ocean Sunset');
  });

  it('returns 503 on service unavailable generation error', async () => {
    vi.mocked(groqModule.generateWallpaperConfigGroq).mockRejectedValueOnce(
      new geminiModule.AiGenerationError('unavailable')
    );
    vi.mocked(geminiModule.generateWallpaperConfig).mockRejectedValueOnce(
      new geminiModule.AiGenerationError('unavailable')
    );

    const res = await POST(createReq({ prompt: 'cozy cabin' }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.reason).toBe('unavailable');
  });
});
