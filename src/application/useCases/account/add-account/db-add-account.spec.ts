/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/application/useCases/account/add-account/ports';
import { DbAddAccount } from '@/application/useCases/account/add-account';
import {
  mockAccountModel,
  mockAddAccountParams,
  throwError,
} from '@/domain/test';
import { mockAddAccountRepository, mockHasher } from '@/application/test';

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        const account: AccountModel = mockAccountModel();
        return Promise.resolve(null as any);
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(mockAddAccountParams());
    expect(hasherSpy).toHaveBeenCalledWith('any_password');
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });
  it('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
  it('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(mockAccountModel()));
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });
});
