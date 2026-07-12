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

// Normalize error responses so callers can read `error.message` reliably,
// and broadcast two global signals the rest of the app can react to without
// every single API caller needing its own special-case handling:
//   - 'interviewiq:sessionExpired' — token was rejected as invalid/expired
//   - 'interviewiq:networkError'   — request never reached the server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response;
    const status = error.response?.status;
    const requestHadToken = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && requestHadToken) {
      window.dispatchEvent(new CustomEvent('interviewiq:sessionExpired'));
    } else if (isNetworkError) {
      window.dispatchEvent(new CustomEvent('interviewiq:networkError'));
    }

    const message = isNetworkError
      ? 'Could not reach the server. Check your connection and try again.'
      : error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const details = error.response?.data?.details || null;

    return Promise.reject({ message, details, status, isNetworkError });
  },
);

export default api;
