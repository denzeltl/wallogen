import { AiGenerateResponse, AiWallpaperConfig } from '@/types';
import { fallbackConfigFromPrompt } from './fallback';

export type AiNoticeKind = 'daily_limit' | 'busy' | 'unavailable';

export interface AiNotice {
  kind: AiNoticeKind;
  /** Epoch ms when trying the AI again makes sense */
  retryAt?: number;
}

export interface AiResult {
  config: AiWallpaperConfig;
  source: 'ai' | 'fallback';
  notice?: AiNotice;
}

const COOLDOWN_KEY = 'wallogen.aiCooldown';
const REQUEST_TIMEOUT_MS = 15_000;

interface Cooldown {
  kind: AiNoticeKind;
  until: number;
}

function readCooldown(): Cooldown | null {
  try {
    const raw = window.localStorage.getItem(COOLDOWN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cooldown;
    if (typeof parsed.until !== 'number' || parsed.until <= Date.now()) {
      window.localStorage.removeItem(COOLDOWN_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCooldown(cooldown: Cooldown) {
  try {
    window.localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldown));
  } catch {
    // Storage unavailable (private mode etc.): we'll just ask the server again next time
  }
}

function fallback(prompt: string, notice: AiNotice): AiResult {
  return { config: fallbackConfigFromPrompt(prompt), source: 'fallback', notice };
}

/**
 * Ask the AI for a wallpaper config. Never rejects: when the AI is out of
 * quota, busy or offline, returns a local keyword-based close match plus a
 * notice the UI turns into a soft message.
 */
export async function requestAiWallpaper(prompt: string): Promise<AiResult> {
  // Skip the network entirely while we know the quota is used up
  const cooldown = readCooldown();
  if (cooldown) return fallback(prompt, { kind: cooldown.kind, retryAt: cooldown.until });

  let data: AiGenerateResponse;
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    data = (await res.json()) as AiGenerateResponse;
  } catch {
    return fallback(prompt, { kind: 'unavailable' });
  }

  if (data.ok) return { config: data.config, source: 'ai' };

  if (data.reason === 'daily_limit' || data.reason === 'busy') {
    const retryAt = Date.now() + (data.retryAfterSeconds ?? 60) * 1000;
    writeCooldown({ kind: data.reason, until: retryAt });
    return fallback(prompt, { kind: data.reason, retryAt });
  }

  return fallback(prompt, { kind: 'unavailable' });
}

/** "in about 3 hours", "in about a minute" */
export function describeRetry(retryAt: number | undefined, now: number = Date.now()): string | null {
  if (!retryAt) return null;
  const minutes = Math.max(1, Math.round((retryAt - now) / 60_000));
  if (minutes < 2) return 'in about a minute';
  if (minutes < 60) return `in about ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? 'in about an hour' : `in about ${hours} hours`;
}
