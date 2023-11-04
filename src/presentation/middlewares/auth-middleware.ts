/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http';
import { HttpRequest, Middleware } from '@/presentation/ports';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest) {
    const error = forbidden(new AccessDeniedError());
    return Promise.resolve(error);
  }
}
