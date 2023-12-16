import request from 'supertest';
import { setupApp } from '@/main/config';
import { MongoHelper } from '@/infrastructure/db';
import { Collection } from 'mongodb';
import { jwtSecret } from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import { Express } from 'express';

let surveyCollection: Collection;
let accountCollection: Collection;
let app: Express;
const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin',
  });

  const id = res.insertedId.toHexString();
  const accessToken = sign({ id }, jwtSecret);
  await accountCollection.updateOne(
    {
      _id: res.insertedId,
    },
    {
      $set: {
        accessToken,
      },
    },
  );
  return accessToken;
};
describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = (await setupApp()).app;
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  describe('Surveys Query', () => {
    const query = `query {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }`;

    it('Should return Surveys', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answer: 'Answer 2',
          },
        ],
        date: now,
      });
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.surveys.length).toBe(1);
      expect(res.body.data.surveys[0].id).toBeTruthy();
      expect(res.body.data.surveys[0].question).toBe('Question');
      expect(res.body.data.surveys[0].date).toBe(now.toISOString());
      expect(res.body.data.surveys[0].didAnswer).toBe(false);
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          answer: 'Answer 1',
          image: 'http://image-name.com',
        },
        {
          answer: 'Answer 2',
          image: null,
        },
      ]);
    });
    it('Should return AccessDeniedError if no token is provided', async () => {
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com',
          },
          {
            answer: 'Answer 2',
          },
        ],
        date: new Date(),
      });
      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });
});
