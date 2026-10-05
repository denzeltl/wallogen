import { PatternParams } from '@/types';

export type TunableParam = Exclude<keyof PatternParams, 'customOptions'>;

export interface ParamRange {
  min: number;
  max: number;
  step: number;
}

/**
 * Single source of truth for slider bounds.
 * Shared by the Tuning sliders and the AI config validator.
 */
export const PARAM_RANGES: Record<TunableParam, ParamRange> = {
  seed: { min: 1, max: 99999, step: 1 },
  scale: { min: 0.4, max: 3.0, step: 0.1 },
  density: { min: 2, max: 40, step: 1 },
  complexity: { min: 1, max: 10, step: 1 },
  noiseIntensity: { min: 0, max: 0.3, step: 0.01 },
  rotation: { min: 0, max: 360, step: 15 },
};

/**
 * Clamp a value into a param's range and snap it to the slider step.
 */
export function clampParam(key: TunableParam, value: number): number {
  const { min, max, step } = PARAM_RANGES[key];
  if (!Number.isFinite(value)) return min;
  const clamped = Math.min(max, Math.max(min, value));
  const snapped = Math.round((clamped - min) / step) * step + min;
  // Remove floating point drift (e.g. 0.30000000000000004)
  return Number(Math.min(max, snapped).toFixed(4));
}
