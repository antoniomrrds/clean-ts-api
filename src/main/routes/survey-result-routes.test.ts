import request from 'supertest';
import { app } from '@/main/config';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import { jwtSecret } from '@/shared/infrastructure/env-config';
import MockDate from 'mockdate';
let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
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

describe('SurveyResult Routes', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
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

  describe('PUT /surveys/:surveId/results', () => {
    it('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answers: [
            {
              answer: 'any_answer',
            },
          ],
        })
        .expect(403);
    });
    it('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const res = await surveyCollection.insertOne({
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
        date: new Date(),
      });
      const id = res?.insertedId;
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1',
        })
        .expect(200);
    });
  });
});
