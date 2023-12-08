import { mockAddAccountParams } from '@/tests/domain/mocks';
import { AccountMongoRepository, MongoHelper } from '@/infrastructure/db';
import { Collection } from 'mongodb';
import { faker } from '@faker-js/faker';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};
let accountCollection: Collection;

const addAccountParams = mockAddAccountParams();
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
      const isValid = await sut.add(addAccountParams);
      expect(isValid).toBeTruthy();
    });
  });
  describe('loadByEmail()', () => {
    it('Should return an account on loadByEmail on success', async () => {
      const sut = makeSut();
      accountCollection?.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(addAccountParams.name);
      expect(account?.password).toBe(addAccountParams.password);
    });

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeNull();
    });
  });

  describe('checkByEmail()', () => {
    it('Should return true if email is valid', async () => {
      const sut = makeSut();
      await accountCollection?.insertOne(addAccountParams);
      const exists = await sut.checkByEmail(addAccountParams.email);
      expect(exists).toBeTruthy();
    });
    it('Should return false if email is invalid', async () => {
      const sut = makeSut();
      const exists = await sut.checkByEmail(addAccountParams.email);
      expect(exists).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const accessToken = faker.string.uuid();
      const result = await accountCollection?.insertOne(addAccountParams);

      const fakeAccountBefore = await accountCollection?.findOne({
        _id: result?.insertedId,
      });
      const fakeAccountBeforeID = fakeAccountBefore?._id;

      expect(fakeAccountBefore?.accessToken).toBeFalsy();
      await sut.updateAccessToken(String(fakeAccountBeforeID), accessToken);

      const fakeAccountAfter = await accountCollection?.findOne({
        _id: fakeAccountBeforeID,
      });
      expect(fakeAccountAfter).toBeTruthy();

      expect(fakeAccountAfter?.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let name = faker.person.fullName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.string.uuid();

    beforeEach(() => {
      name = faker.person.firstName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.string.uuid();
    });
    it('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection?.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });
    it('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection?.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });
    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeFalsy();
    });
    it('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });
    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });
});
