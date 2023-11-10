import request from 'supertest';
import { app } from '@/main/config';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { jwtSecret } from '@/shared/infrastructure/env-config';
import { sign } from 'jsonwebtoken';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    role: 'admin',
  });

  const fakeAccount = await accountCollection?.findOne({
    _id: result?.insertedId,
  });
  const id = fakeAccount?._id;
  const accessToken = sign({ id }, jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id,
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
