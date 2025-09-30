import request from 'supertest';
import app from '../src/app';

describe('Ultravox API (mock/test call)', () => {
  it('should return success for valid test call', async () => {
    const res = await request(app)
      .post('/ultravox/test-call')
      .send({ userId: 'user123', tenantId: 'tenant123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.callId).toBeDefined();
    expect(res.body.status).toBe('success');
    expect(res.body.userId).toBe('user123');
    expect(res.body.tenantId).toBe('tenant123');
  });

  it('should return 400 for missing userId', async () => {
    const res = await request(app)
      .post('/ultravox/test-call')
      .send({ tenantId: 'tenant123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing userId or tenantId');
  });

  it('should return 400 for missing tenantId', async () => {
    const res = await request(app)
      .post('/ultravox/test-call')
      .send({ userId: 'user123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing userId or tenantId');
  });
});
