/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountModel } from '@/domain/entities';
import { LoadAccountByToken } from '@/domain/usecases';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http';
import { AuthMiddleware } from '@/presentation/middlewares';
import { HttpRequest } from '@/presentation/ports';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
});

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in hearders', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null as unknown as AccountModel));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
