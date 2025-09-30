import request from 'supertest';
import app from '../src/app';

describe('Metrics Endpoints', () => {
  it('should require authentication for metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(401);
  });

  // Add more tests for metrics when authenticated and with data
});
