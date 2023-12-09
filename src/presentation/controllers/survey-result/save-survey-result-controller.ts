import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/ports';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}
  async handle(
    request: SaveSurveyResultController.Request,
  ): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request;
      const error = this.validation.validate(surveyId);
      if (error) {
        return badRequest(error);
      }
      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);
      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'));
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string;
    answer: string;
    accountId: string;
  };
}
