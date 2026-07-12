import api from './axios';

export async function updateSettingsRequest(payload) {
  const { data } = await api.put('/settings', payload);
  return data;
}

export async function changePasswordRequest({ currentPassword, newPassword }) {
  const { data } = await api.post('/settings/change-password', { currentPassword, newPassword });
  return data;
}

export async function logoutAllDevicesRequest() {
  const { data } = await api.post('/settings/logout-all-devices');
  return data;
}
