import ApiError from '../utils/ApiError.js';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT_MS = 20_000;

/**
 * Strips ```json ... ``` / ``` ... ``` code fences that Gemini sometimes
 * wraps its output in even when asked for raw JSON.
 */
function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}

/**
 * Calls Gemini with a single text prompt and expects a JSON object back.
 * Throws ApiError for every failure mode (missing key, network error,
 * non-2xx response, malformed JSON) so callers can just try/catch once.
 *
 * @param {string} prompt
 * @param {{ temperature?: number }} options
 * @returns {Promise<object>}
 */
export async function callGeminiJSON(prompt, { temperature = 0.7 } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new ApiError(
      500,
      'GEMINI_API_KEY is not configured on the server. Add it to backend/.env.',
    );
  }

  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(502, 'The AI service took too long to respond. Please try again.');
    }
    throw new ApiError(502, 'Could not reach the AI service. Check your connection and try again.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || '';
    } catch {
      // response body wasn't JSON — ignore, we'll use a generic message
    }
    if (response.status === 429) {
      throw new ApiError(429, 'The AI service is rate-limited right now. Please wait a moment and try again.');
    }
    throw new ApiError(
      502,
      detail ? `AI service error: ${detail}` : 'The AI service returned an error. Please try again.',
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(502, 'The AI service returned an unreadable response.');
  }

  const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    // Common cause: the response was blocked by safety filters.
    const finishReason = payload?.candidates?.[0]?.finishReason;
    throw new ApiError(
      502,
      finishReason
        ? `The AI service could not complete this request (${finishReason}).`
        : 'The AI service returned an empty response.',
    );
  }

  try {
    return JSON.parse(stripCodeFences(rawText));
  } catch {
    throw new ApiError(502, 'The AI service returned a response we could not parse.');
  }
}
