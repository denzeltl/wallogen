import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWallpaperConfigGroq } from '../groq';

describe('Groq API provider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'gsk_mock_test_key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws unavailable if GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY;
    await expect(generateWallpaperConfigGroq('calm ocean')).rejects.toThrow();
  });

  it('parses valid Groq JSON response and validates wallpaper config', async () => {
    const mockGroqResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Groq Sunset',
              rationale: 'Calm waves',
              patternId: 'waves',
              mode: 'dark',
              background: '#0a0a1a',
              colors: ['#ff5e62', '#ff9966', '#00c6ff'],
              scale: 1,
              density: 8,
              complexity: 4,
              noiseIntensity: 0.05,
              rotation: 0,
            }),
          },
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockGroqResponse), { status: 200 })
    );

    const config = await generateWallpaperConfigGroq('calm sunset ocean');
    expect(config.title).toBe('Groq Sunset');
    expect(config.patternId).toBe('waves');
    expect(config.palette.colors.length).toBeGreaterThanOrEqual(3);
  });
});
