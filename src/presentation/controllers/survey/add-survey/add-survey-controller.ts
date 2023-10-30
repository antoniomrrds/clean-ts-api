/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/survey/add-survey/ports';
import { badRequest, serverError } from '@/presentation/helpers/http';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validate: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers,
      });

      return null as any;
    } catch (error) {
      return serverError(error);
    }
  }
}
