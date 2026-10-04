export type DeviceCategory = 'desktop' | 'mobile' | 'tablet' | 'custom';

export interface DevicePreset {
  id: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  aspectRatio: string;
  iconName?: string;
}

export type ColorMode = 'light' | 'dark';

export interface Palette {
  id: string;
  name: string;
  mode: ColorMode;
  background: string;
  colors: string[];
}

export interface PatternParams {
  seed: number;
  scale: number;
  density: number;
  complexity: number;
  noiseIntensity: number;
  rotation: number;
  customOptions?: Record<string, number | string | boolean>;
}

export interface WallpaperPattern {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'gradient' | 'geometric' | 'abstract';
  defaultParams: PatternParams;
  render: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    palette: Palette,
    params: PatternParams
  ) => void;
}

export interface WallpaperState {
  patternId: string;
  paletteId: string;
  customPalette: Palette | null;
  devicePresetId: string;
  customWidth: number;
  customHeight: number;
  params: PatternParams;
  deviceFrame: 'none' | 'desktop' | 'mobile' | 'tablet';
}
