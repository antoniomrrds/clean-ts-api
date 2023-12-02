import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { Collection } from 'mongodb';
import MockDate from 'mockdate';
import {
  mockAddAccountParams,
  mockSurveyParams,
  mockSurveysModels,
} from '@/domain/test';
import { AccountModel, SurveyModel } from '@/domain/entities';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const insertSurvey = await surveyCollection.insertMany(mockSurveysModels());
  const res = await surveyCollection.findOne({
    _id: insertSurvey.insertedIds[0],
  });
  return MongoHelper.map(res);
};

const mockAccount = async (): Promise<AccountModel> => {
  const insertAccount = await accountCollection.insertOne(
    mockAddAccountParams(),
  );
  const res = await accountCollection.findOne({
    _id: insertAccount.insertedId,
  });
  return MongoHelper.map(res);
};

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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection?.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });
  describe('add()', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockSurveyParams());
      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });
      expect(survey).toBeTruthy();
    });
  });
  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      const account = await mockAccount();
      const survey = await mockSurvey();
      const addSurveyModels = mockSurveysModels();
      await surveyResultCollection.insertOne({
        surveyId: MongoHelper.objectId(survey.id),
        accountId: MongoHelper.objectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();
      const surveys = await sut.loadAll(account.id);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });
    it('Should load empty list', async () => {
      const account = await mockAccount();
      const sut = makeSut();
      const surveys = await sut.loadAll(account.id);
      expect(surveys.length).toBe(0);
    });
  });
  describe('loadById()', () => {
    it('Should load survey by id on success', async () => {
      const insertSurvey = await surveyCollection.insertOne(mockSurveyParams());
      const surveyResult = insertSurvey.insertedId.toString();

      const sut = makeSut();
      const survey = await sut.loadById(surveyResult);
      expect(survey).toBeTruthy();
      expect(survey?.id).toBeTruthy();
    });
  });
});
