import api from './axios';

export async function startInterviewRequest({ resumeId, company }) {
  const { data } = await api.post('/interviews/start', { resumeId, company });
  return data;
}

export async function getActiveInterviewRequest() {
  const { data } = await api.get('/interviews/active');
  return data;
}

export async function getInterviewHistoryRequest() {
  const { data } = await api.get('/interviews/history');
  return data;
}

export async function getInterviewSessionRequest(sessionId) {
  const { data } = await api.get(`/interviews/session/${sessionId}`);
  return data;
}

export async function submitAnswerRequest(sessionId, { questionId, answerText, skipped }) {
  const { data } = await api.post(`/interviews/session/${sessionId}/answer`, {
    questionId,
    answerText,
    skipped,
  });
  return data;
}

export async function retryEvaluationRequest(sessionId, answerId) {
  const { data } = await api.post(`/interviews/session/${sessionId}/answer/${answerId}/retry`);
  return data;
}

export async function saveProgressRequest(sessionId, draftAnswerText) {
  const { data } = await api.patch(`/interviews/session/${sessionId}/save-progress`, {
    draftAnswerText,
  });
  return data;
}

export async function finishInterviewRequest(sessionId) {
  const { data } = await api.post(`/interviews/session/${sessionId}/finish`);
  return data;
}

export async function getInterviewReportRequest(interviewId) {
  const { data } = await api.get(`/interviews/${interviewId}`);
  return data;
}
