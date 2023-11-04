/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadAccountByToken } from '@/domain/usecases';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http';
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/ports';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }

    return forbidden(new AccessDeniedError());
  }
}
