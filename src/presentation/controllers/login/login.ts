/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  EmailValidator,
} from '@/presentation/controllers/login/ports';

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

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
