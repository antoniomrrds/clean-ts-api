import request from 'supertest';
import { app } from '@/main/config';
import { MongoHelper } from '@/infrastructure/db';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
describe('Login Routes', () => {
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        })
        .expect(201);
    });
  });

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('any_password', 12);
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password,
      });
      await request(app)
        .post('/api/login')
        .send({
          password: 'any_password',
          email: 'any_email@mail.com',
        })
        .expect(200);
    });

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          password: 'any_password',
          email: 'any_email@mail.com',
        })
        .expect(401);
    });
  });
});
