/* eslint-disable @typescript-eslint/no-unused-vars */
import { Authentication } from '@/domain/entities';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError, unauthorized } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';
import { EmailValidator } from '@/presentation/ports/email-validator';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = request.body;

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const acessToken = await this.authentication.auth(email, password);
      console.log(acessToken);
      if (!acessToken) {
        return unauthorized();
      }
      return new Promise(resolve => resolve({ statusCode: 200, body: {} }));
    } catch (error) {
      return serverError(error);
    }
  }
}
