/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http';
import { AuthMiddleware } from '@/presentation/middlewares';
import { HttpRequest } from '@/presentation/ports';

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in hearders', async () => {
    const sut = new AuthMiddleware();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
