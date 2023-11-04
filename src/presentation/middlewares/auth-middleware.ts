/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadAccountByToken } from '@/domain/usecases';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok } from '@/presentation/helpers/http';
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/ports';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);
      if (account) {
        return ok({ accountId: account.id });
      }
    }

    return forbidden(new AccessDeniedError());
  }
}
