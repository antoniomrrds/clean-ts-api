import {
  mockAddAccountParams,
  mockAccountModel,
  throwError,
} from '@/tests/domain/mocks';

import {
  AddAccountRepositorySpy,
  HasherSpy,
  LoadAccountByEmailRepositorySpy,
} from '@/tests/application/mocks';
import { DbAddAccount } from '@/application/usecases';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
};

const addAccountParams = mockAddAccountParams();

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.accountModel = null!;
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  );
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  };
};

describe('DbAddAccount Usecase', () => {
  beforeEach(() => {});
  it('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut();
    await sut.add(addAccountParams);
    expect(hasherSpy.plaintext).toBe(addAccountParams.password);
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);

    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();
    await sut.add(addAccountParams);
    expect(addAccountRepositorySpy.Params).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest,
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow();
  });

  it('Should returns true if loadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut();
    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBe(true);
  });
  it('Should return false if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel();
    const isValid = await sut.add(addAccountParams);
    expect(isValid).toBe(false);
  });
  it('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.add(addAccountParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });
});
