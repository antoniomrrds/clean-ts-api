import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { Collection } from 'mongodb';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
let accountCollection: Collection;
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('surveys');
    await accountCollection?.deleteMany({});
  });

  it('Should add a survey on success', async () => {
    const sut = makeSut();
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
    });
    const survey = await accountCollection.findOne({
      question: 'any_question',
    });
    expect(survey).toBeTruthy();
  });
});
