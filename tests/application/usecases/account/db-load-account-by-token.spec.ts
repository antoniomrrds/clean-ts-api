import { DbLoadAccountByToken } from '@/application/usecases';
import { throwError } from '@/tests/domain/mocks';
import {
  DecrypterSpy,
  LoadAccountByTokenRepositorySpy,
} from '@/tests/application/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterSpy: DecrypterSpy;
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  );
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  };
};

let role: string;
let token: string;

describe('DBLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.string.uuid();
    role = faker.lorem.word();
  });
  it('Should call Decrypter with correct ciphertext', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load(token, role);
    expect(decrypterSpy.ciphertext).toBe(token);
  });

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.plaintext = null!;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  it('Should call loadAccountByTokenRepositorySpy with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.load(token, role);
    expect(loadAccountByTokenRepositorySpy.token).toBe(token);
    expect(loadAccountByTokenRepositorySpy.role).toBe(role);
  });

  it('Should return null if loadAccountByTokenRepositorySpy return null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.result = null!;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  it('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const account = await sut.load(token, role);
    expect(account).toEqual(loadAccountByTokenRepositorySpy.result);
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if loadAccountByTokenRepositorySpy throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError);
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });
});
