/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve =>
      resolve(badRequest(new MissingParamError('email'))),
    );
  }
}
