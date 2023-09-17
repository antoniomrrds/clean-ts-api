import { MissingParamError } from '@/presentation/errors';
import { HttpRequest, HttpResponse } from '@/presentation/ports';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }
  }
}
