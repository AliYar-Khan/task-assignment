import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

describe('Tenant Data Isolation', () => {
  let tenantAId: string;
  let tenantBId: string;
  let userAToken: string;
  let userBToken: string;

  beforeAll(async () => {
    // Connect to test DB
    await mongoose.connect(process.env.MONGODB_URI || '', {});

    // Create Tenant A and Tenant B
    const tenantA = await request(app)
      .post('/tenants')
      .set('x-api-key', process.env.API_KEY || '')
      .send({ name: 'TenantA', subdomain: 'tenantA', logoUrl: '', color: '#fff' });
    tenantAId = tenantA.body._id;

    const tenantB = await request(app)
      .post('/tenants')
      .set('x-api-key', process.env.API_KEY || '')
      .send({ name: 'TenantB', subdomain: 'tenantB', logoUrl: '', color: '#000' });
    tenantBId = tenantB.body._id;

    // Signup user for Tenant A
    const userA = await request(app)
      .post('/auth/signup')
      .send({ email: 'userA@a.com', password: 'pass123', tenantSubdomain: 'tenantA' });
    userAToken = userA.body.token;

    // Signup user for Tenant B
    const userB = await request(app)
      .post('/auth/signup')
      .send({ email: 'userB@b.com', password: 'pass123', tenantSubdomain: 'tenantB' });
    userBToken = userB.body.token;
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should allow userA to access only TenantA data', async () => {
    const res = await request(app)
      .get(`/tenants/tenantA`)
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.subdomain).toBe('tenantA');
  });

  it('should forbid userA from accessing TenantB data', async () => {
    const res = await request(app)
      .get(`/tenants/tenantB`)
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(403);
  });

  it('should forbid userB from accessing TenantA data', async () => {
    const res = await request(app)
      .get(`/tenants/tenantA`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(res.status).toBe(403);
  });
});