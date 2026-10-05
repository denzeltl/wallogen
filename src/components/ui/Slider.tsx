'use client';

import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  isLocked?: boolean;
  onToggleLock?: () => void;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  isLocked = false,
  onToggleLock,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {onToggleLock && (
            <button
              onClick={onToggleLock}
              aria-label={isLocked ? `Unlock ${label} parameter` : `Lock ${label} parameter from randomizing`}
              className={`p-2 min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                isLocked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title={isLocked ? 'Unlock slider value' : 'Lock slider value from randomizing'}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          )}
          <span className={`text-xs font-medium ${isLocked ? 'text-amber-300 font-semibold' : 'text-zinc-300'}`}>
            {label}
          </span>
        </div>

        <span
          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${
            isLocked
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-zinc-200 bg-zinc-800 border-zinc-700/60'
          }`}
        >
          {displayValue}
        </span>
      </div>

      <div className="relative h-8 flex items-center group touch-none">
        <div className="absolute inset-x-0 h-2 rounded-full bg-zinc-800 border border-zinc-700/40" />
        <div
          className={`absolute left-0 h-2 rounded-full transition-all duration-75 ${
            isLocked ? 'bg-amber-500' : 'bg-cyan-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={`${label} slider, current value ${displayValue}`}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
        />
        <div
          className={`absolute w-5 h-5 rounded-full bg-white border-2 shadow-md transition-all duration-75 pointer-events-none group-hover:scale-110 ${
            isLocked ? 'border-amber-500 shadow-amber-500/30' : 'border-cyan-400 shadow-cyan-500/30'
          }`}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
};
