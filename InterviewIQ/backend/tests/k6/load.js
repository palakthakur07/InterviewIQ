import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<800'] },
};

const BASE = __ENV.BASE_URL || 'http://localhost:5000';

// k6 counts every 4xx/5xx as a failed request by default. The empty-body login is
// *supposed* to return 400, so mark 400 as an expected status for that request only.
const expect400 = http.expectedStatuses(400);

export default function () {
  const res = http.get(`${BASE}/api/health`);
  check(res, { 'health 200': (r) => r.status === 200 });

  const bad = http.post(`${BASE}/api/auth/login`, JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
    responseCallback: expect400,
  });
  check(bad, { 'empty login 400': (r) => r.status === 400 });

  sleep(1);
}