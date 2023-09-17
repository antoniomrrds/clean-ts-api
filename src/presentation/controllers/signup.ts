import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '@/presentation/ports';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
  }
}
