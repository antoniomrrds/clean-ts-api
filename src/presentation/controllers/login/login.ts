/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';
import { EmailValidator } from '@/presentation/ports/email-validator';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { email, password } = request.body;
    if (!email) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError('email'))),
      );
    }
    if (!password) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError('password'))),
      );
    }
    const isValid = this.emailValidator.isValid(email);
    if (!isValid) {
      return new Promise(resolve =>
        resolve(badRequest(new InvalidParamError('email'))),
      );
    }

    return new Promise(resolve => resolve({ statusCode: 200, body: {} }));
  }
}
