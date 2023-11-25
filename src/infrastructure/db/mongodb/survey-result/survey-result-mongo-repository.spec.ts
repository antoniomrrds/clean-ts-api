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
      { image: 'any_image', answer: 'any_answer_1' },
      { answer: 'any_answer_2' },
      { answer: 'any_answer_3' },
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
      const survey = await makeFakeSurvey();
      const account = await makeFakeAccount();
      const sut = makeSut();
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(account.id),
      });
      expect(surveyResult).toBeTruthy();
    });
    it('Should update survey result if its not new', async () => {
      const sut = makeSut();
      const survey = await makeFakeSurvey();
      const account = await makeFakeAccount();
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
        })
        .toArray();
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });
  describe('loadBySurveyId()', () => {
    it('Should load survey result', async () => {
      const sut = makeSut();
      const survey = await makeFakeSurvey();
      const account = await makeFakeAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: MongoHelper.objectId(survey.id),
          accountId: MongoHelper.objectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId.toString()).toEqual(survey.id.toString());
      expect(surveyResult?.answers[0].count).toBe(2);
      expect(surveyResult?.answers[0].percent).toBe(50);
      expect(surveyResult?.answers[1].count).toBe(2);
      expect(surveyResult?.answers[1].percent).toBe(50);
      expect(surveyResult?.answers[2].count).toBe(0);
      expect(surveyResult?.answers[2].percent).toBe(0);
    });
  });
});
