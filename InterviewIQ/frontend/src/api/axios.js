import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request if we have one stored.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('interviewiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so callers can read `error.message` reliably.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    const details = error.response?.data?.details || null;
    return Promise.reject({ message, details, status: error.response?.status });
  },
);

export default api;
