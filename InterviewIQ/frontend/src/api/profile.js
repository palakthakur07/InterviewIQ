import api from './axios';

export async function getProfileRequest() {
  const { data } = await api.get('/profile');
  return data;
}

export async function updateProfileRequest({ name, college, branch, graduationYear }) {
  const { data } = await api.put('/profile', { name, college, branch, graduationYear });
  return data;
}

export async function uploadAvatarRequest(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  const { data } = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
