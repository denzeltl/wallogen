import { describe, it, expect } from 'vitest';
import { validateAiConfig } from '../validate';
import { PATTERN_IDS } from '../catalog';
import { PARAM_RANGES } from '@/lib/engine/params';

describe('validateAiConfig', () => {
  it('returns safe default config when passed empty or null input', () => {
    const config = validateAiConfig(null);
    expect(config.patternId).toBe('meshGradients');
    expect(config.title).toBe('AI Wallpaper');
    expect(config.rationale).toBe('');
    expect(config.palette.mode).toBe('dark');
    expect(config.palette.colors.length).toBeGreaterThanOrEqual(3);
    expect(config.params.scale).toBe(1);
    expect(config.params.density).toBe(8);
  });

  it('preserves valid patternId and replaces unknown patternId with fallback', () => {
    const valid = validateAiConfig({ patternId: 'waves' });
    expect(valid.patternId).toBe('waves');

    const invalid = validateAiConfig({ patternId: 'unknown_magic_pattern' });
    expect(invalid.patternId).toBe('meshGradients');
  });

  it('normalizes hex colors and tops up palette to at least 3 colors', () => {
    const config = validateAiConfig({
      palette: {
        mode: 'light',
        background: '#FFF',
        colors: ['#f00', 'invalid-color', '#00ff00', '123456'],
      },
    });

    expect(config.palette.mode).toBe('light');
    expect(config.palette.background).toBe('#ffffff');
    expect(config.palette.colors).toContain('#ff0000');
    expect(config.palette.colors).toContain('#00ff00');
    expect(config.palette.colors.length).toBeGreaterThanOrEqual(3);
    config.palette.colors.forEach((c) => {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('sanitizes and clamps text fields (title & rationale)', () => {
    const config = validateAiConfig({
      title: '  <script>alert(1)</script>   Long title exceeding limits '.repeat(5),
      rationale: '<img src=x onerror=alert(1)> Rationale text \u0000 control chars',
    });

    expect(config.title).not.toContain('<');
    expect(config.title).not.toContain('>');
    expect(config.title.length).toBeLessThanOrEqual(48);

    expect(config.rationale).not.toContain('<');
    expect(config.rationale).not.toContain('>');
    expect(config.rationale).not.toContain('\u0000');
    expect(config.rationale.length).toBeLessThanOrEqual(160);
  });

  it('clamps numeric parameters within PARAM_RANGES', () => {
    const config = validateAiConfig({
      params: {
        scale: 999,
        density: -50,
        complexity: 100,
        noiseIntensity: 5.5,
        rotation: 720,
      },
    });

    expect(config.params.scale).toBeLessThanOrEqual(PARAM_RANGES.scale.max);
    expect(config.params.density).toBeGreaterThanOrEqual(PARAM_RANGES.density.min);
    expect(config.params.complexity).toBeLessThanOrEqual(PARAM_RANGES.complexity.max);
    expect(config.params.noiseIntensity).toBeLessThanOrEqual(PARAM_RANGES.noiseIntensity.max);
    expect(config.params.rotation).toBeLessThanOrEqual(PARAM_RANGES.rotation.max);
  });

  it('handles NaN and non-numeric inputs by falling back to safe numeric defaults', () => {
    const config = validateAiConfig({
      params: {
        scale: NaN,
        density: 'not-a-number',
        complexity: Infinity,
        noiseIntensity: null,
        rotation: undefined,
      },
    });

    expect(Number.isFinite(config.params.scale)).toBe(true);
    expect(Number.isFinite(config.params.density)).toBe(true);
    expect(Number.isFinite(config.params.complexity)).toBe(true);
    expect(Number.isFinite(config.params.noiseIntensity)).toBe(true);
    expect(Number.isFinite(config.params.rotation)).toBe(true);
  });
});
