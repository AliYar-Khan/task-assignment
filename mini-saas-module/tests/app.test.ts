import request from 'supertest';
import app from '../src/app';
// Use Jest's global expect, describe, and it

describe('App Initialization and Routing', () => {
  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  // Add more tests to verify tenant management routes and module handling
});

// Remove custom expect function; use the imported one from node:test or Jest.
