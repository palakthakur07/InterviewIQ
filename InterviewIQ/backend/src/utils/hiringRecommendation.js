const VERDICTS = ['Strong Hire', 'Hire', 'Borderline', 'No Hire'];

/**
 * Derives a hiring recommendation from the interview's overall score.
 * Kept as a local heuristic (not a Gemini call) so finishing an interview
 * never costs an extra AI request — thresholds are intentionally simple
 * and easy to tune.
 *
 * @param {number|null} overallScore - average score (0-10) across evaluated answers
 * @returns {{ verdict: string, explanation: string }}
 */
export function getHiringRecommendation(overallScore) {
  if (overallScore === null || overallScore === undefined || Number.isNaN(overallScore)) {
    return {
      verdict: 'Borderline',
      explanation:
        'Not enough evaluated answers were available to make a confident recommendation.',
    };
  }

  if (overallScore >= 8.5) {
    return {
      verdict: 'Strong Hire',
      explanation: `An average score of ${overallScore.toFixed(1)}/10 reflects consistently strong, well-structured answers across the interview.`,
    };
  }

  if (overallScore >= 7) {
    return {
      verdict: 'Hire',
      explanation: `An average score of ${overallScore.toFixed(1)}/10 shows solid performance with only minor gaps to address.`,
    };
  }

  if (overallScore >= 5) {
    return {
      verdict: 'Borderline',
      explanation: `An average score of ${overallScore.toFixed(1)}/10 is mixed — some strong answers alongside noticeable weaknesses worth practicing further.`,
    };
  }

  return {
    verdict: 'No Hire',
    explanation: `An average score of ${overallScore.toFixed(1)}/10 indicates significant gaps that would need real improvement before a real interview.`,
  };
}

export { VERDICTS };
