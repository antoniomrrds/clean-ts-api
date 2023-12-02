import { MongoHelper, LogMongoRepository } from '@/infrastructure/db';
import { faker } from '@faker-js/faker';
import { Collection } from 'mongodb';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};
let error: string;
describe('Log Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });
  beforeEach(async () => {
    error = faker.lorem.words();
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  it('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError(error);
    errorCollection = await MongoHelper.getCollection('errors');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
