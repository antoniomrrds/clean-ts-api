import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from '@/presentation/controllers/system-of-login/login/ports';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = request.body;

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
