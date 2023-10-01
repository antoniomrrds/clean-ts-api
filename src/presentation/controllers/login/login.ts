/* eslint-disable @typescript-eslint/no-unused-vars */
import { Authentication } from '@/domain/entities';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';
import { EmailValidator } from '@/presentation/ports/email-validator';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
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
      this.authentication.auth(email, password);

      return new Promise(resolve => resolve({ statusCode: 200, body: {} }));
    } catch (error) {
      return serverError(error);
    }
  }
}
