/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
} from '@/application/useCases/account/authentication/ports';

import { DbAuthentication } from '@/application/useCases/account/authentication';
import {
  mockAccountModel,
  mockAuthenticationParams,
  throwError,
} from '@/domain/test';
import {
  mockEncrypter,
  mockHashCompare,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from '@/application/test';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const encrypterStub = mockEncrypter();
  const hashCompareStub = mockHashCompare();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  it('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(mockAuthenticationParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    expect(promise).rejects.toThrow();
  });

  it('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null as any);
    const model = await sut.auth(mockAuthenticationParams());
    expect(model).toBeNull();
  });

  it('Should calls HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const autheticationModel = mockAuthenticationParams();
    const hashSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(autheticationModel);
    expect(hashSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    expect(promise).rejects.toThrow();
  });

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));
    const model = await sut.auth(mockAuthenticationParams());
    expect(model).toBeNull();
  });

  it('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const autheticationModel = mockAuthenticationParams();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(autheticationModel);
    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    expect(promise).rejects.toThrow();
  });

  it('Should return an  AuthenticationModel on success', async () => {
    const { sut } = makeSut();
    const { accessToken, name } = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe('any_token');
    expect(name).toBe(mockAccountModel().name);
  });

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );
    await sut.auth(mockAuthenticationParams());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    expect(promise).rejects.toThrow();
  });
});
