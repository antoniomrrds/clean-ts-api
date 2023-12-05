import { Authentication } from '@/domain/usecases';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/ports';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}
  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = request;

      const AuthenticationModel = await this.authentication.auth({
        email,
        password,
      });
      if (!AuthenticationModel) {
        return unauthorized();
      }

      return ok(AuthenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}
