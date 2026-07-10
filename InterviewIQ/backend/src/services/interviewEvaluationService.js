import { callGeminiJSON } from './geminiService.js';
import { getCompanyStyle } from '../utils/companyStyles.js';

function buildPrompt({ question, answerText, company }) {
  const { style } = getCompanyStyle(company);

  return `You are an experienced technical interviewer conducting ${style}

The candidate was asked this ${question.type} interview question (topic: ${question.topic}):
"${question.text}"

The candidate answered:
"${answerText}"

Evaluate this answer as an interviewer would. Then decide if ONE natural follow-up
question is worth asking to probe deeper (only if the answer was vague, surprising,
or invites a reasonable "why"/"how" — otherwise leave followUp as null).

Respond with ONLY a JSON object (no markdown, no prose) in exactly this shape:
{
  "score": <number 0-10>,
  "strengths": ["short strength", ...up to 3],
  "weaknesses": ["short weakness", ...up to 3],
  "suggestedAnswer": "a concise example of a stronger answer, 2-4 sentences",
  "confidence": <number 0-100, how confident you are in this evaluation>,
  "followUp": { "text": "the follow-up question", "topic": "short topic label" } or null
}`;
}

function clamp(value, min, max, fallback) {
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function normalizeStringArray(value, maxItems) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim())
    .slice(0, maxItems);
}

function normalizeEvaluation(raw) {
  const evaluation = {
    score: clamp(raw?.score, 0, 10, 5),
    strengths: normalizeStringArray(raw?.strengths, 3),
    weaknesses: normalizeStringArray(raw?.weaknesses, 3),
    suggestedAnswer: typeof raw?.suggestedAnswer === 'string' ? raw.suggestedAnswer.trim() : '',
    confidence: clamp(raw?.confidence, 0, 100, 60),
  };

  let followUp = null;
  if (raw?.followUp && typeof raw.followUp === 'object') {
    const text = typeof raw.followUp.text === 'string' ? raw.followUp.text.trim() : '';
    if (text) {
      followUp = {
        text,
        topic: typeof raw.followUp.topic === 'string' && raw.followUp.topic.trim()
          ? raw.followUp.topic.trim()
          : 'follow-up',
      };
    }
  }

  return { evaluation, followUp };
}

/**
 * Evaluates a single answer against its question via Gemini.
 * @param {{ question: object, answerText: string, company: string }} params
 * @returns {Promise<{ evaluation: object, followUp: {text: string, topic: string} | null }>}
 */
export async function evaluateAnswer({ question, answerText, company }) {
  const prompt = buildPrompt({ question, answerText, company });
  const raw = await callGeminiJSON(prompt, { temperature: 0.4 });
  return normalizeEvaluation(raw);
}
