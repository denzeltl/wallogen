import { NextRequest, NextResponse } from 'next/server';
import { AiGenerateResponse, AiWallpaperConfig } from '@/types';
import { AiGenerationError, generateWallpaperConfig } from '@/lib/ai/gemini';
import { generateWallpaperConfigGroq } from '@/lib/ai/groq';
import { checkRateLimit } from '@/lib/ai/rateLimit';
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from '@/lib/ai/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function reply(body: AiGenerateResponse, status: number) {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
  if (!body.ok && body.retryAfterSeconds) headers['Retry-After'] = String(body.retryAfterSeconds);
  return NextResponse.json(body, { status, headers });
}

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
}

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    const body = (await req.json()) as { prompt?: unknown };
    if (typeof body.prompt === 'string') prompt = body.prompt;
  } catch {
    // Fall through to the empty-prompt check
  }

  prompt = prompt.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (prompt.length < MIN_PROMPT_LENGTH || prompt.length > MAX_PROMPT_LENGTH) {
    return reply({ ok: false, reason: 'invalid_prompt' }, 400);
  }

  const limit = checkRateLimit(clientKey(req));
  if (!limit.allowed) {
    return reply({ ok: false, reason: limit.reason, retryAfterSeconds: limit.retryAfterSeconds }, 429);
  }

  let config: AiWallpaperConfig | null = null;
  let lastError: unknown = null;

  // 1. Try Groq API primary provider if GROQ_API_KEY is configured
  if (process.env.GROQ_API_KEY?.trim()) {
    try {
      config = await generateWallpaperConfigGroq(prompt);
    } catch (err) {
      lastError = err;
      console.warn('[api/ai/generate] Groq provider failed, falling back to Gemini:', err instanceof Error ? err.message : err);
    }
  }

  // 2. Try Gemini API secondary provider if Groq was not used or failed
  if (!config && process.env.GEMINI_API_KEY?.trim()) {
    try {
      config = await generateWallpaperConfig(prompt);
    } catch (err) {
      lastError = err;
      console.warn('[api/ai/generate] Gemini provider failed:', err instanceof Error ? err.message : err);
    }
  }

  if (config) {
    return reply({ ok: true, config }, 200);
  }

  if (lastError instanceof AiGenerationError) {
    const status = lastError.reason === 'unavailable' ? 503 : 429;
    return reply({ ok: false, reason: lastError.reason, retryAfterSeconds: lastError.retryAfterSeconds }, status);
  }

  return reply({ ok: false, reason: 'unavailable' }, 503);
}
