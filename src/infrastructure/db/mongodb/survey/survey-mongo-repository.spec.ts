import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { Collection } from 'mongodb';
import MockDate from 'mockdate';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
let surveyCollection: Collection;
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
  });
  describe('add()', () => {
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
        date: new Date(),
      });
      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });
      expect(survey).toBeTruthy();
    });
  });
});
