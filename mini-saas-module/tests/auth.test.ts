import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Auth Routes', () => {
  const testTenantId = new mongoose.Types.ObjectId().toString();
  const testEmail = 'testuser@example.com';
  const testPassword = 'TestPass123!';

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        tenantId: testTenantId,
        email: testEmail,
        password: testPassword,
        role: 'user'
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
  });

  it('should not sign up a duplicate user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        tenantId: testTenantId,
        email: testEmail,
        password: testPassword,
        role: 'user'
      });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('User already exists');
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        tenantId: testTenantId,
        email: testEmail,
        password: testPassword
      });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        tenantId: testTenantId,
        email: testEmail,
        password: 'WrongPassword123!'
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should not login with non-existent user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        tenantId: testTenantId,
        email: 'nouser@example.com',
        password: testPassword
      });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
