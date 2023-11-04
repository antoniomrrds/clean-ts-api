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

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in hearders', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount());
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount());
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const sut = new AuthMiddleware(loadAccountByTokenStub);
    await sut.handle({
      headers: {
        'x-access-token': 'any_token',
      },
    });
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});
