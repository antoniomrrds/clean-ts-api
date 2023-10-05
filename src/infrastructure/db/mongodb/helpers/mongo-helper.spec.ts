import { MongoHelper as sut } from '@/infrastructure/db/mongodb/helpers/mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await sut.disconnect();
  });
  it('Should reconnect if mongodb is down', async () => {
    const accountCollection = sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    expect(sut.isConnected).toBe(false);
    await sut.getCollection('accounts');
    expect(sut.isConnected).toBe(true);
  });
});
