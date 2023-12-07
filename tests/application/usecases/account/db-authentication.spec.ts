import { DbAuthentication } from '@/application/usecases';
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks';
import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy,
} from '@/tests/application/mocks';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const encrypterSpy = new EncrypterSpy();
  const hashComparerSpy = new HashComparerSpy();
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  };
};

const autheticationParams = mockAuthenticationParams();
describe('DbAuthentication UseCase', () => {
  it('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(autheticationParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(
      autheticationParams.email,
    );
  });

  it('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError);
    const promise = sut.auth(autheticationParams);
    expect(promise).rejects.toThrow();
  });

  it('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = null!;
    const model = await sut.auth(autheticationParams);
    expect(model).toBeNull();
  });

  it('Should calls HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(autheticationParams);
    expect(hashComparerSpy.plaintext).toBe(autheticationParams.password);
    expect(hashComparerSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.accountModel.password,
    );
  });

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError);
    const promise = sut.auth(autheticationParams);
    expect(promise).rejects.toThrow();
  });

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.isValid = false;
    const model = await sut.auth(autheticationParams);
    expect(model).toBeNull();
  });

  it('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(autheticationParams);
    expect(encrypterSpy.plaintext).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id,
    );
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);
    const promise = sut.auth(autheticationParams);
    expect(promise).rejects.toThrow();
  });

  it('Should return data on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    const { accessToken, name } = await sut.auth(autheticationParams);
    expect(accessToken).toBe(encrypterSpy.ciphertext);
    expect(name).toBe(loadAccountByEmailRepositorySpy.accountModel.name);
  });

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      loadAccountByEmailRepositorySpy,
      encrypterSpy,
    } = makeSut();
    await sut.auth(autheticationParams);
    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id,
    );
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext);
  });

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError);
    const promise = sut.auth(autheticationParams);
    await expect(promise).rejects.toThrow();
  });
});
