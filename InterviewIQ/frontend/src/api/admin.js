import api from './axios';

export async function getAdminDashboardRequest() {
  const { data } = await api.get('/admin/dashboard');
  return data;
}
