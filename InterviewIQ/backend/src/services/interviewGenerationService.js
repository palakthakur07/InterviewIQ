import { callGeminiJSON } from './geminiService.js';
import { getCompanyStyle } from '../utils/companyStyles.js';
import ApiError from '../utils/ApiError.js';

const BASE_QUESTION_COUNT = 6;
const QUESTION_TYPES = ['technical', 'project', 'behavioral', 'follow-up'];

function buildResumeContext(resume) {
  const skills = resume.skills?.length ? resume.skills.join(', ') : 'not specified';
  const technologies = resume.technologies?.length ? resume.technologies.join(', ') : 'not specified';
  const projects = resume.projects?.length
    ? resume.projects
        .map((p, i) => `  ${i + 1}. ${p.title}${p.description ? ` — ${p.description}` : ''}`)
        .join('\n')
    : '  (no projects detected on the resume)';

  return `Skills: ${skills}\nTechnologies: ${technologies}\nProjects:\n${projects}`;
}

function buildPrompt(resume, companyId) {
  const { style } = getCompanyStyle(companyId);
  const resumeContext = buildResumeContext(resume);

  return `You are an experienced technical interviewer conducting ${style}

Here is the candidate's resume summary:
${resumeContext}

Generate exactly ${BASE_QUESTION_COUNT} interview questions tailored to this candidate. Rules:
- At least 2 questions must be "technical" (about their listed skills/technologies).
- At least 2 questions must be "project" (reference a specific project from the resume by name if possible).
- At least 1 question must be "behavioral".
- Order them naturally, starting with an easier warm-up question.
- Do not repeat topics. Keep each question to 1-3 sentences.
- Do not include any explanation, only the questions.

Respond with ONLY a JSON array (no markdown, no prose) in exactly this shape:
[
  { "type": "technical" | "project" | "behavioral", "text": "the question", "topic": "short topic label, e.g. a skill or project name" }
]`;
}

function normalizeQuestions(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((q) => ({
      type: QUESTION_TYPES.includes(q?.type) ? q.type : 'technical',
      text: typeof q?.text === 'string' ? q.text.trim() : '',
      topic: typeof q?.topic === 'string' && q.topic.trim() ? q.topic.trim() : 'general',
    }))
    .filter((q) => q.text.length > 0)
    .slice(0, BASE_QUESTION_COUNT);
}

/**
 * Generates the initial batch of interview questions for a session.
 * @param {{ resume: object, company: string }} params
 * @returns {Promise<Array<{type: string, text: string, topic: string}>>}
 */
export async function generateInterviewQuestions({ resume, company }) {
  const prompt = buildPrompt(resume, company);
  const raw = await callGeminiJSON(prompt, { temperature: 0.8 });
  const questions = normalizeQuestions(raw);

  if (questions.length < 3) {
    throw new ApiError(
      502,
      'The AI service did not generate enough interview questions. Please try again.',
    );
  }

  return questions;
}

export { BASE_QUESTION_COUNT };
