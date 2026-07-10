import api from './axios';

export async function signupRequest({ name, email, password }) {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return data;
}

export async function loginRequest({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}
