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
const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin',
  });

  const id = result.insertedId.toHexString();
  const accessToken = sign({ id }, jwtSecret);
  await accountCollection.updateOne(
    {
      _id: result.insertedId,
    },
    {
      $set: {
        accessToken,
      },
    },
  );
  return accessToken;
};
describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    it('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com/image.jpg',
              answer: 'Answer 1',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(403);
    });

    it('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com/image.jpg',
              answer: 'Answer 1',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('Should return 403 on load survey without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    it('Should return 200 on load survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
          ],
          date: new Date(),
        },
      ]);
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
