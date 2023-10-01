import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { LogMongoRepository } from '@/infrastructure/db/mongodb/log-repository';
import { Collection } from 'mongodb';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any_error');
    errorCollection = await MongoHelper.getCollection('errors');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
