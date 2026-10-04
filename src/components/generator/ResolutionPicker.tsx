'use client';

import React, { useState } from 'react';
import { DEVICE_PRESETS } from '@/lib/devices';
import { Monitor, Smartphone, Tablet, SlidersHorizontal, Check } from 'lucide-react';

interface ResolutionPickerProps {
  selectedPresetId: string;
  customWidth: number;
  customHeight: number;
  onSelectPreset: (presetId: string) => void;
  onChangeCustomDimensions: (width: number, height: number) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-3.5 h-3.5" />,
  mobile: <Smartphone className="w-3.5 h-3.5" />,
  tablet: <Tablet className="w-3.5 h-3.5" />,
  custom: <SlidersHorizontal className="w-3.5 h-3.5" />,
};

export const ResolutionPicker: React.FC<ResolutionPickerProps> = ({
  selectedPresetId,
  customWidth,
  customHeight,
  onSelectPreset,
  onChangeCustomDimensions,
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile' | 'all'>('desktop');

  const filteredPresets = DEVICE_PRESETS.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'desktop') return p.category === 'desktop' || p.category === 'tablet';
    return p.category === 'mobile';
  });

  const isCustom = selectedPresetId === 'custom';

  return (
    <div className="space-y-3">
      {/* Uniform Header Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Target Screen Size
        </span>

        {/* Segmented Filter Pills */}
        <div role="group" aria-label="Device preset filter" className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-300">
          <button
            onClick={() => setActiveTab('desktop')}
            aria-label="Show desktop presets"
            aria-pressed={activeTab === 'desktop'}
            className={`px-2.5 py-1.5 min-h-[36px] rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'desktop' ? 'bg-zinc-800 text-white font-medium' : 'hover:text-zinc-100'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            aria-label="Show mobile presets"
            aria-pressed={activeTab === 'mobile'}
            className={`px-2.5 py-1.5 min-h-[36px] rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'mobile' ? 'bg-zinc-800 text-white font-medium' : 'hover:text-zinc-100'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setActiveTab('all')}
            aria-label="Show all resolution presets"
            aria-pressed={activeTab === 'all'}
            className={`px-2.5 py-1.5 min-h-[36px] rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'all' ? 'bg-zinc-800 text-white font-medium' : 'hover:text-zinc-100'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Uniform Preset Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredPresets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          const icon = CATEGORY_ICONS[preset.category] || <Monitor className="w-3.5 h-3.5" />;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              aria-label={`Select ${preset.name} (${preset.width} by ${preset.height} pixels)`}
              className={`flex items-center justify-between p-2.5 min-h-[48px] rounded-xl border text-left transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/70 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {icon}
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-xs text-zinc-100 truncate">{preset.name}</div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {preset.id === 'custom'
                      ? `${customWidth}×${customHeight}`
                      : `${preset.width}×${preset.height}`}
                  </div>
                </div>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Custom Dimension Inputs */}
      {isCustom && (
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 mt-2 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-zinc-300">Custom Pixel Dimensions</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="320"
                max="8192"
                value={customWidth}
                onChange={(e) =>
                  onChangeCustomDimensions(parseInt(e.target.value) || 1920, customHeight)
                }
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-medium block mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="320"
                max="8192"
                value={customHeight}
                onChange={(e) =>
                  onChangeCustomDimensions(customWidth, parseInt(e.target.value) || 1080)
                }
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
