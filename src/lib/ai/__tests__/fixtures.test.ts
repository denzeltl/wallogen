import { describe, it, expect } from 'vitest';
import fixtures from '../__fixtures__/prompts.json';
import { fallbackConfigFromPrompt } from '../fallback';
import { validateAiConfig } from '../validate';
import { generateWallpaperConfig } from '../gemini';
import { PATTERN_IDS } from '../catalog';
import { PARAM_RANGES } from '@/lib/engine/params';

describe('Milestone 6.5 Fixtures Quality Check', () => {
  it('runs all 20 fixture prompts through fallback and validator producing strictly valid configs', () => {
    expect(fixtures.prompts.length).toBe(20);

    for (const fixture of fixtures.prompts) {
      const config = fallbackConfigFromPrompt(fixture.prompt);
      const validated = validateAiConfig(config);

      // Verify pattern is recognized
      expect(PATTERN_IDS).toContain(validated.patternId);

      // Verify title is non-empty and sanitized
      expect(validated.title).toBeTruthy();
      expect(validated.title).not.toMatch(/[\u0000-\u001f\u007f<>]/);

      // Verify rationale is clean
      expect(validated.rationale).not.toMatch(/[\u0000-\u001f\u007f<>]/);

      // Verify palette is valid with at least 3 hex colors
      expect(['light', 'dark']).toContain(validated.palette.mode);
      expect(validated.palette.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(validated.palette.colors.length).toBeGreaterThanOrEqual(3);
      validated.palette.colors.forEach((hex) => {
        expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
      });

      // Verify parameters stay strictly inside engine ranges
      expect(validated.params.scale).toBeGreaterThanOrEqual(PARAM_RANGES.scale.min);
      expect(validated.params.scale).toBeLessThanOrEqual(PARAM_RANGES.scale.max);

      expect(validated.params.density).toBeGreaterThanOrEqual(PARAM_RANGES.density.min);
      expect(validated.params.density).toBeLessThanOrEqual(PARAM_RANGES.density.max);

      expect(validated.params.complexity).toBeGreaterThanOrEqual(PARAM_RANGES.complexity.min);
      expect(validated.params.complexity).toBeLessThanOrEqual(PARAM_RANGES.complexity.max);

      expect(validated.params.noiseIntensity).toBeGreaterThanOrEqual(PARAM_RANGES.noiseIntensity.min);
      expect(validated.params.noiseIntensity).toBeLessThanOrEqual(PARAM_RANGES.noiseIntensity.max);

      expect(validated.params.rotation).toBeGreaterThanOrEqual(PARAM_RANGES.rotation.min);
      expect(validated.params.rotation).toBeLessThanOrEqual(PARAM_RANGES.rotation.max);
    }
  });

  it('handles malicious model output injections in validator', () => {
    const maliciousOutput = {
      title: '<script>alert("hacked")</script> Bad Title',
      rationale: '<iframe src="malicious.site"></iframe>',
      patternId: 'NON_EXISTENT_PATTERN',
      palette: {
        mode: 'unknown_mode',
        background: 'rgb(255, 0, 0)', // non-hex
        colors: ['#GGGGGG', 'not-a-color', '#123456'],
      },
      params: {
        scale: Infinity,
        density: -9999,
        complexity: 'very complex',
        noiseIntensity: NaN,
        rotation: 3600,
      },
    };

    const validated = validateAiConfig(maliciousOutput);

    expect(validated.patternId).toBe('meshGradients');
    expect(validated.title).not.toContain('<script>');
    expect(validated.rationale).not.toContain('<iframe>');
    expect(validated.palette.mode).toBe('dark');
    expect(validated.palette.background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(validated.palette.colors).toContain('#123456');
    expect(validated.palette.colors.length).toBeGreaterThanOrEqual(3);
    expect(Number.isFinite(validated.params.scale)).toBe(true);
    expect(Number.isFinite(validated.params.density)).toBe(true);
    expect(Number.isFinite(validated.params.noiseIntensity)).toBe(true);
  });

  // Optional live Gemini API test run if key is configured in environment
  const liveKey = process.env.GEMINI_API_KEY;
  if (liveKey) {
    it('generates valid config from live Gemini API', async () => {
      const config = await generateWallpaperConfig('minimal sand dunes');
      expect(PATTERN_IDS).toContain(config.patternId);
      expect(config.title).toBeTruthy();
      expect(config.palette.colors.length).toBeGreaterThanOrEqual(3);
    }, 15000);
  }
});
