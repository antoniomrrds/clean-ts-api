import { badRequest, created, serverError } from '@/presentation/helpers/http';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
} from '@/presentation/controllers/signup/ports';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);

      const { email, password, name } = httpRequest.body;

      const accountData = await this.addAccount.add({
        email,
        name,
        password,
      });
      return created(accountData);
    } catch (error) {
      return serverError(error);
    }
  }
}
