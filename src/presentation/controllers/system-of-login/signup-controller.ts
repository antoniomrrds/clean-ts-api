import {
  badRequest,
  created,
  forbidden,
  serverError,
} from '@/presentation/helpers';

import { EmailInUseError } from '@/presentation/errors';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/ports';
import { AddAccount, Authentication } from '@/domain/usecases';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);

      const { email, password, name } = httpRequest.body;

      const account = await this.addAccount.add({
        email,
        name,
        password,
      });

      if (!account) return forbidden(new EmailInUseError(email));

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
