/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';
import { EmailValidator } from '@/presentation/ports/email-validator';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
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
    this.emailValidator.isValid(request.body?.email);

    return new Promise(resolve => resolve({ statusCode: 200, body: {} }));
  }
}
