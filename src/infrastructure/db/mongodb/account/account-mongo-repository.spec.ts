import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { Collection } from 'mongodb';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
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
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });

  describe('add()', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });
  describe('loadByEmail()', () => {
    it('Should return an account on loadByEmail on success', async () => {
      const sut = makeSut();
      accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeNull();
    });
  });

  describe('updateAccessToken()', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      });

      const fakeAccountBefore = await accountCollection?.findOne({
        _id: result?.insertedId,
      });
      const fakeAccountBeforeID = fakeAccountBefore?._id;

      expect(fakeAccountBefore?.accessToken).toBeFalsy();
      await sut.updateAccessToken(String(fakeAccountBeforeID), 'any_token');

      const fakeAccountAfter = await accountCollection?.findOne({
        _id: fakeAccountBeforeID,
      });
      expect(fakeAccountAfter).toBeTruthy();

      expect(fakeAccountAfter?.accessToken).toBe('any_token');
    });
  });
});
