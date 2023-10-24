import {
  badRequest,
  created,
  forbidden,
  serverError,
} from '@/presentation/helpers/http';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication,
} from '@/presentation/controllers/signup/ports';
import { EmailInUseError } from '@/presentation/errors';

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

      const accessToken = await this.authentication.auth({ email, password });
      return created({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
