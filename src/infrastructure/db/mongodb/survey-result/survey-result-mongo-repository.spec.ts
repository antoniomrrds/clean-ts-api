import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { SurveyResultMongoRepository } from '@/infrastructure/db/mongodb/survey-result';
import { Collection } from 'mongodb';
import MockDate from 'mockdate';
import { AccountModel, SurveyModel } from '@/domain/entities';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const insertSurvey = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      { image: 'any_image', answer: 'any_answer' },
      { answer: 'other_answer' },
    ],
    date: new Date(),
  });
  const res = await surveyCollection.findOne({ _id: insertSurvey.insertedId });
  return MongoHelper.map(res);
};

const makeFakeAccount = async (): Promise<AccountModel> => {
  const insertAccount = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });
  const res = await accountCollection.findOne({
    _id: insertAccount.insertedId,
  });
  return MongoHelper.map(res);
};

describe('SurveyResultMongoRepository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection?.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });
  describe('save()', () => {
    it('Should add a survey result if its new', async () => {
      const sut = makeSut();
      const survey = await makeFakeSurvey();
      const account = await makeFakeAccount();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('Should update a survey result if its not new', async () => {
      const sut = makeSut();
      const survey = await makeFakeSurvey();
      const account = await makeFakeAccount();
      const insertSurvey = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const res = await surveyResultCollection.findOne({
        _id: insertSurvey.insertedId,
      });

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(res?._id.toString());
      expect(surveyResult.answer).toBe(survey.answers[1].answer);
    });
  });
});