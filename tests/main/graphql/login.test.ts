import request from 'supertest';
import { setupApp } from '@/main/config';
import { MongoHelper } from '@/infrastructure/db';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { Express } from 'express';
describe('Login GraphQL', () => {
  let accountCollection: Collection;
  let app: Express;

  beforeAll(async () => {
    app = (await setupApp()).app;
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  describe('Login Query ', () => {
    const query = `query {
      login (email: "any_email@mail.com", password: "123") {
        accessToken
        name
      }
    }`;

    it('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password,
      });
      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.login.accessToken).toBeTruthy();
      expect(res.body.data.login.name).toBe('any_name');
    });
    it('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(401);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Unauthorized');
    });
  });
  describe('SignUp Mutation', () => {
    const query = `mutation {
      signup (name: "any_name", email: "any_email@mail.com", password: "123", passwordConfirmation: "123") {
        accessToken
        name
      }
    }`;

    it('Should return an Account on valid data', async () => {
      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.signup.accessToken).toBeTruthy();
      expect(res.body.data.signup.name).toBe('any_name');
    });
    it('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password,
      });
      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe(
        'The received email any_email@mail.com is already in use',
      );
    });
  });
});
