import { AddSurvey } from '@/domain/usecases';
import { badRequest, noContent, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/ports';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validate: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}
  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validate.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = request;
      await this.addSurvey.add({
        question,
        answers,
        date: new Date(),
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace AddSurveyController {
  export type Request = {
    question: string;
    answers: Array<Answer>;
  };

  type Answer = {
    image?: string;
    answer: string;
  };
}
