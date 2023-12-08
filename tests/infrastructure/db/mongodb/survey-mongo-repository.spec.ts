import { MongoHelper, SurveyMongoRepository } from '@/infrastructure/db';
import { Collection } from 'mongodb';
import MockDate from 'mockdate';
import { mockAddAccountParams, mockSurveyParams } from '@/tests/domain/mocks';
import { faker } from '@faker-js/faker';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const insertAccount = await accountCollection.insertOne(
    mockAddAccountParams(),
  );
  return insertAccount?.insertedId.toHexString();
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
      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });
  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      const accountId = await mockAccountId();
      const addSurveyModels = [mockSurveyParams(), mockSurveyParams()];
      const result = await surveyCollection.insertMany(addSurveyModels);
      const survey = await surveyCollection.findOne({
        _id: result.insertedIds[0],
      });
      await surveyResultCollection.insertOne({
        surveyId: survey?._id,
        accountId: MongoHelper.objectId(accountId),
        answer: survey?.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });
    it('Should load empty list', async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
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
  describe('checkById()', () => {
    it('Should return true if survey exists', async () => {
      const insertSurvey = await surveyCollection.insertOne(mockSurveyParams());
      const surveyResult = insertSurvey.insertedId.toString();

      const sut = makeSut();
      const exists = await sut.checkById(surveyResult);
      expect(exists).toBe(true);
    });
    it('Should return false if survey not exists', async () => {
      const sut = makeSut();
      const exists = await sut.checkById(faker.database.mongodbObjectId());
      expect(exists).toBe(false);
    });
  });
});
