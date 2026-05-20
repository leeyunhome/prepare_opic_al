// Minimal Gemini REST client. The API key is held in localStorage and
// appended as a query string param — that's OK because this is a strict
// BYOK app: only the user's own key is ever used and it stays in their browser.

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export class GeminiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function generate({
  apiKey,
  model = 'gemini-2.0-flash',
  systemInstruction,
  history, // array of {role: 'user'|'model', text: string}
  temperature = 0.95,
  topP = 0.95,
}) {
  if (!apiKey) throw new GeminiError('Missing API key.');
  if (!history || !history.length) throw new GeminiError('Empty history.');

  const body = {
    systemInstruction: systemInstruction
      ? { role: 'system', parts: [{ text: systemInstruction }] }
      : undefined,
    contents: history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    generationConfig: {
      temperature,
      topP,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      // Loosen safety so a candid coaching tone (e.g. "honestly that was kind of robotic")
      // doesn't get filtered as harmful.
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const url = `${BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new GeminiError(`HTTP ${res.status} (non-JSON response)`, { status: res.status });
  }

  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    throw new GeminiError(msg, { status: res.status, body: data });
  }

  const candidate = data?.candidates?.[0];
  if (!candidate) {
    const reason = data?.promptFeedback?.blockReason || 'no candidate';
    throw new GeminiError(`Gemini returned no candidate (${reason}).`, { body: data });
  }

  const parts = candidate?.content?.parts || [];
  const text = parts.map((p) => p.text || '').join('').trim();
  if (!text) {
    throw new GeminiError(`Empty response (finishReason=${candidate.finishReason || 'unknown'}).`, { body: data });
  }
  return { text, raw: data };
}

export async function testKey({ apiKey, model = 'gemini-2.0-flash' }) {
  const { text } = await generate({
    apiKey,
    model,
    systemInstruction: 'You are a test endpoint. Reply with the single word "ok" and nothing else.',
    history: [{ role: 'user', text: 'ping' }],
    temperature: 0,
  });
  return text;
}
