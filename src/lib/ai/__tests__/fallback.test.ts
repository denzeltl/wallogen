import { describe, it, expect } from 'vitest';
import { fallbackConfigFromPrompt } from '../fallback';
import { PATTERN_IDS } from '../catalog';

describe('fallbackConfigFromPrompt', () => {
  it('generates a valid config for standard prompts', () => {
    const config = fallbackConfigFromPrompt('calm ocean at dusk');
    expect(PATTERN_IDS).toContain(config.patternId);
    expect(config.title).toBeTruthy();
    expect(config.rationale).toContain('Matched');
    expect(config.palette.colors.length).toBeGreaterThanOrEqual(3);
  });

  it('matches dark/light mode keywords correctly', () => {
    const darkConfig = fallbackConfigFromPrompt('dark moody night');
    expect(darkConfig.palette.mode).toBe('dark');

    const lightConfig = fallbackConfigFromPrompt('bright snowy morning light');
    expect(lightConfig.palette.mode).toBe('light');
  });

  it('adjusts parameters for calm vs busy vs grainy keywords', () => {
    const calm = fallbackConfigFromPrompt('minimal calm clean zen');
    const busy = fallbackConfigFromPrompt('busy chaotic energetic dense wild');

    expect(calm.params.density).toBeLessThan(busy.params.density);
    expect(calm.params.complexity).toBeLessThan(busy.params.complexity);

    const grainy = fallbackConfigFromPrompt('vintage film grain paper texture');
    expect(grainy.params.noiseIntensity).toBeGreaterThan(calm.params.noiseIntensity);
  });

  it('is deterministic for identical prompts', () => {
    const prompt = 'cozy autumn afternoon with coffee';
    const first = fallbackConfigFromPrompt(prompt);
    const second = fallbackConfigFromPrompt(prompt);

    expect(first).toEqual(second);
  });

  it('handles empty, symbol-only, or hostile prompts gracefully', () => {
    const emptyConfig = fallbackConfigFromPrompt('');
    expect(emptyConfig.title).toBe('Close Match');
    expect(emptyConfig.rationale).toBeTruthy();

    const symbolsConfig = fallbackConfigFromPrompt('!@#$%^&*()_+');
    expect(symbolsConfig.title).toBe('Close Match');

    const scriptConfig = fallbackConfigFromPrompt('<script>alert("xss")</script>');
    expect(scriptConfig.title).not.toContain('<script>');
  });
});
