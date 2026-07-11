import api from './axios';

export async function getResultRequest(interviewId) {
  const { data } = await api.get(`/results/${interviewId}`);
  return data;
}

export async function getHistoryRequest() {
  const { data } = await api.get('/history');
  return data;
}

export async function deleteHistoryItemRequest(id) {
  const { data } = await api.delete(`/history/${id}`);
  return data;
}

export async function getReportRequest(id) {
  const { data } = await api.get(`/report/${id}`);
  return data;
}

export async function trackPdfGenerationRequest(interviewId) {
  const { data } = await api.post('/report/pdf', { interviewId });
  return data;
}
