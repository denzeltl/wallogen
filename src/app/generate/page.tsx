'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
import { WallogenLogo } from '@/components/WallogenLogo';
import { CanvasViewport } from '@/components/generator/CanvasViewport';
import { ControlsPanel } from '@/components/generator/ControlsPanel';
import { DEFAULT_PATTERN, getPatternById } from '@/lib/engine';
import { DEFAULT_PALETTE } from '@/lib/palettes';
import { DEVICE_PRESETS, DEFAULT_DEVICE_PRESET } from '@/lib/devices';
import { PatternParams, Palette } from '@/types';
import { exportWallpaper } from '@/lib/engine/exporter';

export default function GeneratorPage() {
  const [patternId, setPatternId] = useState<string>(DEFAULT_PATTERN.id);
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);
  const [presetId, setPresetId] = useState<string>(DEFAULT_DEVICE_PRESET.id);
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  
  const [params, setParams] = useState<PatternParams>({
    seed: 42,
    scale: 1.0,
    density: 6,
    complexity: 4,
    noiseIntensity: 0.05,
    rotation: 0,
  });

  const activeDevicePreset = useMemo(() => {
    return DEVICE_PRESETS.find((p) => p.id === presetId) || DEFAULT_DEVICE_PRESET;
  }, [presetId]);

  const targetWidth = presetId === 'custom' ? customWidth : activeDevicePreset.width;
  const targetHeight = presetId === 'custom' ? customHeight : activeDevicePreset.height;

  const handleSelectPattern = (newPatternId: string) => {
    setPatternId(newPatternId);
    const pObj = getPatternById(newPatternId);
    setParams({
      ...pObj.defaultParams,
      seed: Math.floor(Math.random() * 10000),
    });
  };

  const handleExport = async (format: 'png' | 'jpeg') => {
    await exportWallpaper({
      patternId,
      palette,
      params,
      width: targetWidth,
      height: targetHeight,
      filename: `wallogen-${patternId}`,
      format,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-zinc-800/80 px-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="h-3.5 w-px bg-zinc-800" />
          <div className="flex items-center gap-1.5">
            <WallogenLogo size={20} />
            <span className="font-bold text-xs tracking-tight hidden sm:inline">Wallogen</span>
          </div>
        </div>

        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
        >
          <Coffee className="w-3 h-3" />
          <span className="hidden sm:inline">Support</span>
        </a>
      </header>

      {/* Main workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <CanvasViewport
          patternId={patternId}
          palette={palette}
          params={params}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
          onSelectPreset={setPresetId}
        />

        <ControlsPanel
          patternId={patternId}
          palette={palette}
          params={params}
          selectedPresetId={presetId}
          customWidth={customWidth}
          customHeight={customHeight}
          exportWidth={targetWidth}
          exportHeight={targetHeight}
          onSelectPattern={handleSelectPattern}
          onSelectPalette={setPalette}
          onSelectPreset={setPresetId}
          onChangeCustomDimensions={(w, h) => {
            setCustomWidth(w);
            setCustomHeight(h);
          }}
          onChangeParams={setParams}
          onExport={handleExport}
        />
      </main>
    </div>
  );
}
