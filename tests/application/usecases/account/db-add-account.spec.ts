import { mockAddAccountParams, throwError } from '@/tests/domain/mocks';

import {
  AddAccountRepositorySpy,
  CheckAccountByEmailRepositorySpy,
  HasherSpy,
} from '@/tests/application/mocks';
import { DbAddAccount } from '@/application/usecases';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy;
};

const addAccountParams = mockAddAccountParams();

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy();
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
  );
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
  };
};

describe('DbAddAccount Usecase', () => {
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

  it('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    addAccountRepositorySpy.result = false;
    const isValid = await sut.add(addAccountParams);
    expect(isValid).toBe(false);
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(addAccountParams);
    await expect(promise).rejects.toThrow();
  });

  it('Should returns on success', async () => {
    const { sut } = makeSut();
    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBe(true);
  });
  it('Should return false if checkAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    checkAccountByEmailRepositorySpy.result = true;
    const isValid = await sut.add(addAccountParams);
    expect(isValid).toBe(false);
  });
  it('Should call checkAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    await sut.add(addAccountParams);
    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });
});
