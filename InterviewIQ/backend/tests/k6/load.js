import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<800'] },
};

const BASE = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const res = http.get(`${BASE}/api/health`);
  check(res, { 'health 200': (r) => r.status === 200 });
  const bad = http.post(`${BASE}/api/auth/login`, JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
  check(bad, { 'empty login 400': (r) => r.status === 400 });
  sleep(1);
}
