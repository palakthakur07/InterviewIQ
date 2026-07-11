import { callGeminiJSON } from './geminiService.js';
import { getCompanyStyle } from '../utils/companyStyles.js';

function buildPrompt({ question, answerText, company }) {
  const { style } = getCompanyStyle(company);

  return `You are an experienced technical interviewer conducting ${style}

The candidate was asked this ${question.type} interview question (topic: ${question.topic}):
"${question.text}"

The candidate answered:
"${answerText}"

Evaluate this answer as an interviewer would. Rate it on all 5 axes below, even if
some feel like a stretch for this question type — do your best estimate for each.
Then decide if ONE natural follow-up question is worth asking to probe deeper (only
if the answer was vague, surprising, or invites a reasonable "why"/"how" — otherwise
leave followUp as null).

Respond with ONLY a JSON object (no markdown, no prose) in exactly this shape:
{
  "score": <number 0-10, overall quality of this answer>,
  "categoryScores": {
    "technical": <number 0-10, technical correctness/depth>,
    "communication": <number 0-10, clarity and structure of the explanation>,
    "problemSolving": <number 0-10, quality of reasoning and approach>,
    "behavioral": <number 0-10, ownership/collaboration/judgment shown>,
    "confidence": <number 0-10, how assured and decisive the answer sounds>
  },
  "strengths": ["short strength", ...up to 3],
  "weaknesses": ["short weakness", ...up to 3],
  "suggestedAnswer": "a concise example of a stronger answer, 2-4 sentences",
  "confidence": <number 0-100, how confident YOU are in this evaluation itself>,
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

const CATEGORY_KEYS = ['technical', 'communication', 'problemSolving', 'behavioral', 'confidence'];

function normalizeCategoryScores(raw, fallbackScore) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const result = {};
  CATEGORY_KEYS.forEach((key) => {
    result[key] = clamp(source[key], 0, 10, fallbackScore);
  });
  return result;
}

function normalizeEvaluation(raw) {
  const overallScore = clamp(raw?.score, 0, 10, 5);
  const evaluation = {
    score: overallScore,
    strengths: normalizeStringArray(raw?.strengths, 3),
    weaknesses: normalizeStringArray(raw?.weaknesses, 3),
    suggestedAnswer: typeof raw?.suggestedAnswer === 'string' ? raw.suggestedAnswer.trim() : '',
    confidence: clamp(raw?.confidence, 0, 100, 60),
    // Any axis Gemini omits falls back to the overall score rather than a
    // hardcoded default, so aggregates aren't skewed by sparse data.
    categoryScores: normalizeCategoryScores(raw?.categoryScores, overallScore),
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
