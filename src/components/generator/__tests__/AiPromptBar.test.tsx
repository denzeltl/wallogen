import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiPromptBar } from '../AiPromptBar';
import * as aiClient from '@/lib/ai/client';

vi.mock('@/lib/ai/client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/ai/client')>('@/lib/ai/client');
  return {
    ...actual,
    requestAiWallpaper: vi.fn(),
  };
});

describe('AiPromptBar component', () => {
  const defaultProps = {
    canUndo: false,
    onApply: vi.fn(),
    onUndo: vi.fn(),
    onNewVariation: vi.fn(),
    onBusyChange: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders input, placeholder, example prompt chips, and submit button', () => {
    render(<AiPromptBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Describe a wallpaper…');
    expect(input).toBeInTheDocument();

    const submitBtn = screen.getByLabelText('Generate wallpaper from description');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled(); // Disabled when empty prompt

    expect(screen.getByText('calm ocean at dusk')).toBeInTheDocument();
    expect(screen.getByText('neon city in the rain')).toBeInTheDocument();
  });

  it('enables submit button when prompt length is >= MIN_PROMPT_LENGTH (2 characters)', () => {
    render(<AiPromptBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Describe a wallpaper…');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.getByLabelText('Generate wallpaper from description')).toBeDisabled();

    fireEvent.change(input, { target: { value: 'ab' } });
    expect(screen.getByLabelText('Generate wallpaper from description')).not.toBeDisabled();
  });

  it('submits prompt and triggers onApply callback on generation success', async () => {
    const mockResult: aiClient.AiResult = {
      source: 'ai',
      config: {
        title: 'Sunset Waves',
        rationale: 'Calm ocean sunset',
        patternId: 'waves',
        palette: { mode: 'dark', background: '#111827', colors: ['#f43f5e', '#fb923c', '#38bdf8'] },
        params: { scale: 1, density: 8, complexity: 4, noiseIntensity: 0.05, rotation: 0 },
      },
    };

    vi.mocked(aiClient.requestAiWallpaper).mockResolvedValueOnce(mockResult);

    render(<AiPromptBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Describe a wallpaper…');

    fireEvent.change(input, { target: { value: 'sunset ocean' } });
    fireEvent.submit(input.closest('form')!);

    expect(defaultProps.onBusyChange).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(aiClient.requestAiWallpaper).toHaveBeenCalledWith('sunset ocean');
      expect(defaultProps.onApply).toHaveBeenCalledWith(mockResult);
      expect(defaultProps.onBusyChange).toHaveBeenCalledWith(false);
    });

    // Check rendered result header & badges
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Sunset Waves')).toBeInTheDocument();
    expect(screen.getByText('Calm ocean sunset')).toBeInTheDocument();
  });

  it('shows soft notice card when quota or rate limit notice is returned', async () => {
    const mockResultWithNotice: aiClient.AiResult = {
      source: 'fallback',
      notice: { kind: 'daily_limit', retryAt: Date.now() + 3600_000 },
      config: {
        title: 'Close Match',
        rationale: 'Matched ocean',
        patternId: 'waves',
        palette: { mode: 'dark', background: '#000', colors: ['#fff', '#888', '#444'] },
        params: { scale: 1, density: 8, complexity: 4, noiseIntensity: 0.05, rotation: 0 },
      },
    };

    vi.mocked(aiClient.requestAiWallpaper).mockResolvedValueOnce(mockResultWithNotice);

    render(<AiPromptBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Describe a wallpaper…');

    fireEvent.change(input, { target: { value: 'deep sea' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText("Today's free AI wallpapers are all used up")).toBeInTheDocument();
      expect(screen.getByText('Close match')).toBeInTheDocument();
    });
  });

  it('clicking an example chip automatically triggers generation', async () => {
    const mockResult: aiClient.AiResult = {
      source: 'ai',
      config: {
        title: 'Northern Lights',
        rationale: 'Aurora borealis',
        patternId: 'aurora',
        palette: { mode: 'dark', background: '#090d16', colors: ['#10b981', '#06b6d4', '#8b5cf6'] },
        params: { scale: 1, density: 10, complexity: 6, noiseIntensity: 0.04, rotation: 0 },
      },
    };

    vi.mocked(aiClient.requestAiWallpaper).mockResolvedValueOnce(mockResult);

    render(<AiPromptBar {...defaultProps} />);

    const chip = screen.getByText('northern lights');
    fireEvent.click(chip);

    await waitFor(() => {
      expect(aiClient.requestAiWallpaper).toHaveBeenCalledWith('northern lights');
      expect(defaultProps.onApply).toHaveBeenCalledWith(mockResult);
    });
  });

  it('handles action buttons (New Variation, Reinterpret, Undo)', async () => {
    const mockResult: aiClient.AiResult = {
      source: 'ai',
      config: {
        title: 'Cyber City',
        rationale: 'Neon lights',
        patternId: 'stripes',
        palette: { mode: 'dark', background: '#000', colors: ['#f00', '#0f0', '#00f'] },
        params: { scale: 1, density: 10, complexity: 5, noiseIntensity: 0.05, rotation: 0 },
      },
    };

    vi.mocked(aiClient.requestAiWallpaper).mockResolvedValue(mockResult);

    render(<AiPromptBar {...defaultProps} canUndo={true} />);
    const input = screen.getByPlaceholderText('Describe a wallpaper…');

    fireEvent.change(input, { target: { value: 'cyberpunk city' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Cyber City')).toBeInTheDocument();
    });

    // Test New variation button
    const variationBtn = screen.getByLabelText('New variation (same style, new seed)');
    fireEvent.click(variationBtn);
    expect(defaultProps.onNewVariation).toHaveBeenCalledTimes(1);

    // Test Reinterpret button
    const reinterpretBtn = screen.getByLabelText('Reinterpret this description');
    fireEvent.click(reinterpretBtn);
    await waitFor(() => {
      expect(aiClient.requestAiWallpaper).toHaveBeenCalledTimes(2);
    });

    // Test Undo button
    const undoBtn = screen.getByLabelText('Undo: restore the previous wallpaper');
    fireEvent.click(undoBtn);
    expect(defaultProps.onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cyber City')).not.toBeInTheDocument();
  });
});
