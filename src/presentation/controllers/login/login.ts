/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    if (!request.body?.email) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError('email'))),
      );
    }
    if (!request.body?.password) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError('password'))),
      );
    }

    return new Promise(resolve => resolve({ statusCode: 200, body: {} }));
  }
}
