import api from './axios';

export async function getNotificationsRequest() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function markNotificationsReadRequest(id) {
  const { data } = await api.put('/notifications/read', id ? { id } : {});
  return data;
}
