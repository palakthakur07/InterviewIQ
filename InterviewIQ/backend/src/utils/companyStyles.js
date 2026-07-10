// Short, prompt-friendly descriptions of each company's interview style.
// These get dropped straight into the Gemini prompt — keep them factual
// and general (public-knowledge interview conventions), not proprietary.

const COMPANY_STYLES = {
  general: {
    label: 'General',
    style:
      'a balanced, role-agnostic technical interview. Ask clear, direct questions ' +
      'without leaning on any one company\'s specific conventions.',
  },
  google: {
    label: 'Google',
    style:
      'a Google-style interview: favor questions that probe systems-thinking and ' +
      'depth (scalability, edge cases, trade-offs). Encourage the candidate to reason ' +
      'out loud and ask clarifying questions. Prefer precise, somewhat academic phrasing.',
  },
  amazon: {
    label: 'Amazon',
    style:
      'an Amazon-style interview: frame technical and project questions so they also ' +
      'surface ownership, customer impact, and decision-making under ambiguity — the ' +
      'spirit of Amazon\'s Leadership Principles — without naming the principles outright.',
  },
  microsoft: {
    label: 'Microsoft',
    style:
      'a Microsoft-style interview: favor collaborative, design-oriented questions. Ask ' +
      'the candidate to walk through how they would design or improve something, and how ' +
      'they\'d work with teammates or stakeholders on it.',
  },
  atlassian: {
    label: 'Atlassian',
    style:
      'an Atlassian-style interview: favor values-driven, product-aware questions. Ask ' +
      'about trade-offs between speed and quality, teamwork, and how technical decisions ' +
      'affect real users.',
  },
};

export function getCompanyStyle(companyId) {
  return COMPANY_STYLES[companyId] || COMPANY_STYLES.general;
}

export function isValidCompany(companyId) {
  return Object.prototype.hasOwnProperty.call(COMPANY_STYLES, companyId);
}

export default COMPANY_STYLES;
