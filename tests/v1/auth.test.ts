import { app } from '../../src/index'; 
import { prisma } from '../../src/prisma/client';

describe('Auth Routes', () => {
  const testEmail = 'jestuser@example.com';
  const testPassword = 'TestPass123!';
  let userId: number;
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/register',
      payload: {
        name: 'Jest User',
        email: testEmail,
        password: testPassword,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', testEmail);
    userId = body.id;
  });

  it('should not register with existing email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/register',
      payload: {
        name: 'Jest User',
        email: testEmail,
        password: testPassword,
      },
    });
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('Email already in use');
  });

  it('should login with correct credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    token = body.token;
  });

  it('should not login with wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/login',
      payload: {
        email: testEmail,
        password: 'wrongpassword',
      },
    });
    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('Invalid credentials');
  });

  it('should get user profile with valid token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/profile',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.user).toHaveProperty('email', testEmail);
  });

  it('should change password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/change-password',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        oldPassword: testPassword,
        newPassword: 'NewTestPass123!',
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('Password changed successfully');
  });

  it('should send forgot password email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/forgot-password',
      payload: {
        email: testEmail,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toMatch(/reset/i);
  });

  // You can add more tests for reset-password, logout, etc.
});