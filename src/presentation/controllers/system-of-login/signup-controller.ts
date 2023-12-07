import {
  badRequest,
  created,
  forbidden,
  serverError,
} from '@/presentation/helpers';

import { EmailInUseError } from '@/presentation/errors';
import { Controller, HttpResponse, Validation } from '@/presentation/ports';
import { AddAccount, Authentication } from '@/domain/usecases';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}
  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) return badRequest(error);

      const { email, password, name } = request;

      const isValid = await this.addAccount.add({
        email,
        name,
        password,
      });

      if (!isValid) return forbidden(new EmailInUseError(email));

      const AuthenticationModel = await this.authentication.auth({
        email,
        password,
      });
      return created(AuthenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}
