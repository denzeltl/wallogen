'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Palette, PatternParams } from '@/types';
import { renderWallpaper } from '@/lib/engine';
import { isColorLight } from '@/lib/engine/utils';
import { Monitor, Smartphone } from 'lucide-react';

interface CanvasViewportProps {
  patternId: string;
  palette: Palette;
  params: PatternParams;
  targetWidth: number;
  targetHeight: number;
  onSelectPreset?: (presetId: string) => void;
  isGenerating?: boolean;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  patternId,
  palette,
  params,
  targetWidth,
  targetHeight,
  onSelectPreset,
  isGenerating = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<'none' | 'desktop' | 'mobile'>('none');

  const aspectRatio = targetWidth / targetHeight;
  const isLightBg = palette.mode === 'light' || isColorLight(palette.background);

  const handleFrameClick = (frame: 'none' | 'desktop' | 'mobile') => {
    setDeviceFrame(frame);
    if (onSelectPreset) {
      if (frame === 'desktop') onSelectPreset('desktop_4k');
      else if (frame === 'mobile') onSelectPreset('mobile_iphone');
    }
  };

  // Render to canvas — triggers on any param change OR deviceFrame switch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxPreviewDim = 1920;
    let pw = targetWidth;
    let ph = targetHeight;

    if (pw > maxPreviewDim || ph > maxPreviewDim) {
      if (pw >= ph) {
        pw = maxPreviewDim;
        ph = Math.round(maxPreviewDim / aspectRatio);
      } else {
        ph = maxPreviewDim;
        pw = Math.round(maxPreviewDim * aspectRatio);
      }
    }

    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }

    const animId = requestAnimationFrame(() => {
      renderWallpaper(ctx, pw, ph, patternId, palette, params);
    });

    return () => cancelAnimationFrame(animId);
  }, [patternId, palette, params, targetWidth, targetHeight, aspectRatio, deviceFrame]);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-zinc-950/60 overflow-hidden min-h-[260px] sm:min-h-[360px] md:min-h-[400px] pt-14 pb-4 px-3 sm:p-6">
      {/* Top Floating Glass Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] sm:text-xs font-mono text-zinc-300 backdrop-blur-md">
          <span className="text-zinc-100">{targetWidth}×{targetHeight}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-cyan-400 font-semibold">
            {aspectRatio > 1.2 ? 'Landscape' : aspectRatio < 0.8 ? 'Portrait' : 'Square'}
          </span>
        </div>

        <div role="group" aria-label="Device preview frame selector" className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-300 backdrop-blur-md">
          {(['none', 'desktop', 'mobile'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFrameClick(f)}
              aria-label={`Preview frame: ${f}`}
              aria-pressed={deviceFrame === f}
              className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 min-h-[32px] sm:min-h-[36px] rounded-md transition-all font-medium text-[11px] sm:text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                deviceFrame === f
                  ? 'bg-cyan-500 text-zinc-950 shadow-sm font-bold'
                  : 'hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {f === 'none' ? (
                'Raw'
              ) : f === 'desktop' ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="relative flex items-center justify-center w-full h-full max-h-[45vh] sm:max-h-[60vh] md:max-h-[75vh] p-2 sm:p-6">
        {/* Desktop Stand Base */}
        {deviceFrame === 'desktop' && (
          <div className="absolute pointer-events-none flex flex-col items-center z-0">
            <div className="w-14 h-2.5 bg-zinc-800 rounded-b-md mt-[44vh] sm:mt-[54vh]" />
            <div className="w-28 h-1 bg-zinc-700/70 rounded-full" />
          </div>
        )}

        {/* Outer Frame Wrapper */}
        <div
          className={`relative transition-all duration-200 overflow-hidden ${
            deviceFrame === 'desktop'
              ? 'rounded-xl p-2 sm:p-2.5 bg-zinc-900 border-[3px] border-zinc-800 shadow-2xl'
              : deviceFrame === 'mobile'
              ? 'rounded-[32px] sm:rounded-[36px] p-2 sm:p-3 bg-zinc-900 border-[3px] border-zinc-800 shadow-2xl max-h-[42vh] sm:max-h-[65vh]'
              : 'rounded-xl border border-zinc-800/60 shadow-2xl bg-black'
          }`}
        >
          {/* Desktop Mac Window Dots */}
          {deviceFrame === 'desktop' && (
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-green-500/80" />
            </div>
          )}

          {/* Canvas Wrapper Screen Frame */}
          <div
            className={`relative overflow-hidden ${
              deviceFrame === 'desktop'
                ? 'rounded-lg border border-zinc-700/50 bg-black'
                : deviceFrame === 'mobile'
                ? 'rounded-[28px] border border-zinc-700/50 bg-black'
                : 'rounded-lg'
            }`}
          >
            {/* Dynamic Island Notch for Mobile Screen */}
            {deviceFrame === 'mobile' && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 w-16 h-3.5 bg-black rounded-full border border-zinc-800/60 pointer-events-none" />
            )}

            {/* Adaptive Desktop Lockscreen Time Overlay */}
            {deviceFrame === 'desktop' && (
              <div
                className={`absolute top-4 left-5 z-20 pointer-events-none select-none ${
                  isLightBg
                    ? 'text-zinc-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                    : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                }`}
              >
                <div className="text-2xl font-bold tracking-tight">{time}</div>
                <div className={`text-xs font-medium ${isLightBg ? 'text-zinc-700' : 'text-white/80'}`}>
                  {date}
                </div>
              </div>
            )}

            {/* Adaptive Mobile Lockscreen Time Overlay */}
            {deviceFrame === 'mobile' && (
              <div
                className={`absolute top-8 left-0 right-0 z-20 text-center pointer-events-none select-none ${
                  isLightBg
                    ? 'text-zinc-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                    : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                }`}
              >
                <div className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${isLightBg ? 'text-zinc-700' : 'text-white/70'}`}>
                  {date}
                </div>
                <div className="text-3xl font-extrabold tracking-tight">{time}</div>
              </div>
            )}

            {/* Mobile Home Bar */}
            {deviceFrame === 'mobile' && (
              <div
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-20 h-1 rounded-full pointer-events-none ${
                  isLightBg ? 'bg-black/70' : 'bg-white/70'
                }`}
              />
            )}

            {/* AI generation overlay */}
            {isGenerating && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/45 backdrop-blur-[2px] pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-200 shadow-lg">
                  <span className="w-3 h-3 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin motion-reduce:animate-none" />
                  Designing your wallpaper…
                </div>
              </div>
            )}

            {/* Single Persistent Canvas */}
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Wallpaper canvas preview displaying ${patternId} pattern with ${palette.name} palette at ${targetWidth} by ${targetHeight} pixels`}
              className={`block object-contain transition-all duration-150 ${
                deviceFrame === 'desktop'
                  ? 'max-h-[50vh] max-w-[75vw]'
                  : deviceFrame === 'mobile'
                  ? 'max-h-[56vh]'
                  : 'max-h-[62vh] max-w-[85vw]'
              }`}
              style={{ aspectRatio: `${targetWidth}/${targetHeight}` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
