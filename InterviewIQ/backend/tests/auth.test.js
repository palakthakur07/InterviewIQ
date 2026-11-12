import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');

let mongo;
const valid = { name: 'Test User', email: 'test@example.com', password: 'password123' };

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterEach(async () => {
  await User.deleteMany({});
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('POST /api/auth/signup', () => {
  it('registers a user and returns a token without the password', async () => {
    const res = await request(app).post('/api/auth/signup').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe(valid.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate email with 409', async () => {
    await request(app).post('/api/auth/signup').send(valid);
    const res = await request(app).post('/api/auth/signup').send(valid);
    expect(res.status).toBe(409);
  });

  it('rejects missing fields with 400', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email and weak password (no digit / too short)', async () => {
    const badEmail = await request(app).post('/api/auth/signup').send({ ...valid, email: 'not-an-email' });
    const noDigit = await request(app).post('/api/auth/signup').send({ ...valid, password: 'password' });
    const tooShort = await request(app).post('/api/auth/signup').send({ ...valid, password: 'pw1' });
    expect(badEmail.status).toBe(400);
    expect(noDigit.status).toBe(400);
    expect(tooShort.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {

  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/signup').send(valid);
    const res = await request(app).post('/api/auth/login').send({ email: valid.email, password: valid.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('rejects wrong password with 401', async () => {
    await request(app).post('/api/auth/signup').send(valid);
    const res = await request(app).post('/api/auth/login').send({ email: valid.email, password: 'wrongpass1' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('rejects unknown email with the same generic 401 (no user enumeration)', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('rejects missing fields with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: valid.email });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the user for a valid token', async () => {
    const signup = await request(app).post('/api/auth/signup').send(valid);
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${signup.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(valid.email);
  });

  it('rejects a missing token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed/invalid token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.token');
    expect(res.status).toBe(401);
  });

  it('rejects an expired token with 401', async () => {
    const signup = await request(app).post('/api/auth/signup').send(valid);
    const expired = jwt.sign({ sub: signup.body.user.id, tv: 0 }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });

  it('rejects a token signed with the wrong secret', async () => {
    const forged = jwt.sign({ sub: new mongoose.Types.ObjectId().toString(), tv: 0 }, 'wrong-secret');
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });
});