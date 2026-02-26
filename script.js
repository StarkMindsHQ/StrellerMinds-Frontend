import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    'http_req_duration{type:static}': ['p(99)<200'], // Static assets should be fast
    errors: ['rate<0.01'], // Error rate should be less than 1%
  },
};

// Base URL - change this to your deployment URL or localhost
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const SLEEP_DURATION = 1;

export default function () {
  // Scenario 1: Visit Homepage
  group('Homepage', () => {
    const res = http.get(`${BASE_URL}/`);
    
    check(res, {
      'is status 200': (r) => r.status === 200,
      'verify homepage text': (r) => r.body.includes('StrellerMinds'),
    }) || errorRate.add(1);

    sleep(SLEEP_DURATION);
  });

  // Scenario 2: Browse Electives
  group('Electives List', () => {
    const res = http.get(`${BASE_URL}/electives`);
    
    check(res, {
      'is status 200': (r) => r.status === 200,
      'has electives list': (r) => r.body.includes('Elective'),
    }) || errorRate.add(1);

    sleep(SLEEP_DURATION);
  });

  // Scenario 3: View Course Details (Simulated)
  // We pick a known ID or a mock ID from the previous implementation context
  group('Course Details', () => {
    // Using a mock ID from the electives implementation
    const courseId = 'web3-frontend-development'; 
    const res = http.get(`${BASE_URL}/electives/${courseId}`);
    
    check(res, {
      'is status 200': (r) => r.status === 200,
      'has course title': (r) => r.body.includes('Web3'),
    }) || errorRate.add(1);

    sleep(SLEEP_DURATION);
  });

  // Scenario 4: Static Assets (Simulated check for performance)
  group('Static Assets', () => {
    // Requesting a common asset like favicon or a logo if it exists
    // Using a tag to differentiate in thresholds
    const params = { tags: { type: 'static' } };
    const res = http.get(`${BASE_URL}/favicon.ico`, params);
    
    // We don't fail on 404 for favicon in this generic script, but we check timing
    check(res, {
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  });
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// Helper for summary (mocking the built-in k6 summary for this snippet if needed, 
// but k6 provides it by default. We keep the default behavior mostly.)
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';