/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  mockDecrypter,
  mockLoadAccountByTokenRepository,
} from '@/application/test';
import { DbLoadAccountByToken } from '@/application/useCases/account/load-account-by-token';
import {
  Decrypter,
  LoadAccountByTokenRepository,
} from '@/application/useCases/account/load-account-by-token/ports';
import { mockAccountModel, throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DBLoadAccountByToken Usecase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null as any));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  it('Should call loadAccountByTokenRepositoryStub with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  it('Should return null if loadAccountByTokenRepositoryStub return null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null as any));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(mockAccountModel());
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if loadAccountByTokenRepositoryStub throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError);
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
});
