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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    it('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();
      const surveyRes = await surveyCollection.insertOne({
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
      const query = `query {
        surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.surveyResult.question).toBe('Question');
      expect(res.body.data.surveyResult.date).toBe(now.toISOString());
      expect(res.body.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ]);
    });
  });
});
