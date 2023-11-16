import { MongoHelper as sut } from '@/infrastructure/db/mongodb/helpers/mongo-helper';
import { ObjectId } from 'mongodb';

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
it('Should return true if ObjectId is valid', () => {
  const objectId = new ObjectId();
  const isValid = sut.isValidObjectId(objectId.toHexString());
  expect(isValid).toBe(true);
});

it('Should return false if ObjectId is invalid', () => {
  const isValid = sut.isValidObjectId('invalid_id');
  expect(isValid).toBe(false);
});
