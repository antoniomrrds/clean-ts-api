/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/survey/add-survey/ports';
import { badRequest } from '@/presentation/helpers/http';

export class AddSurveyController implements Controller {
  constructor(private readonly validate: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validate.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }
    return new Promise(resolve => resolve(null as any));
  }
}
