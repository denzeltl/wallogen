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
              className={`p-1 rounded-md transition-all active:scale-95 ${
                isLocked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
              title={isLocked ? 'Unlock slider value' : 'Lock slider value from randomizing'}
            >
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>
          )}
          <span className={`text-[11px] font-medium ${isLocked ? 'text-amber-300 font-semibold' : 'text-zinc-400'}`}>
            {label}
          </span>
        </div>

        <span
          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
            isLocked
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-zinc-200 bg-zinc-800 border-zinc-700/60'
          }`}
        >
          {displayValue}
        </span>
      </div>

      <div className="relative h-6 flex items-center group">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-800 border border-zinc-700/40" />
        <div
          className={`absolute left-0 h-1.5 rounded-full transition-all duration-75 ${
            isLocked ? 'bg-amber-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-6 opacity-0 cursor-pointer z-10"
        />
        <div
          className={`absolute w-4 h-4 rounded-full bg-white border-2 shadow-md transition-all duration-75 pointer-events-none group-hover:scale-110 ${
            isLocked ? 'border-amber-500 shadow-amber-500/30' : 'border-blue-600 shadow-blue-600/20'
          }`}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};
