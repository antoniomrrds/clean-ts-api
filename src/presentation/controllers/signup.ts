import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '@/presentation/ports';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    const requiredFields = ['email', 'name'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
