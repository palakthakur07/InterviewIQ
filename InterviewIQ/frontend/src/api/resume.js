import api from './axios';

export async function uploadResumeRequest(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!onUploadProgress || !event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      onUploadProgress(percent);
    },
  });
  return data;
}

export async function listResumesRequest() {
  const { data } = await api.get('/resumes');
  return data;
}

export async function getResumeRequest(id) {
  const { data } = await api.get(`/resumes/${id}`);
  return data;
}
