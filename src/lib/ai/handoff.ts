// Hands a prompt typed on the landing page to the generator, which runs it on arrival.
// sessionStorage rather than a query string keeps the description out of URLs, history and server logs.

const KEY = 'wallogen:pending-prompt';

export function savePendingPrompt(prompt: string): void {
  try {
    sessionStorage.setItem(KEY, prompt);
  } catch {
    // Storage blocked: the generator simply opens without a prompt.
  }
}

/** Returns the pending prompt once, then clears it. */
export function takePendingPrompt(): string | null {
  try {
    const prompt = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return prompt;
  } catch {
    return null;
  }
}
