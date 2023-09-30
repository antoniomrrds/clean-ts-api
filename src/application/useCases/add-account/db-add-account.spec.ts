/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from '@/application/useCases/add-account/ports';
import { DbAddAccount } from '@/application/useCases/add-account';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
});

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeRequest = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return { sut, encrypterStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.add(makeFakeRequest());
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeRequest());
    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(makeFakeRequest());
    const { name, email, password } = makeFakeAccount();
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password,
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeRequest());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeRequest());
    expect(account).toEqual(makeFakeAccount());
  });
});
