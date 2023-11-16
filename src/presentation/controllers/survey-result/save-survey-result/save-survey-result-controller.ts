import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  Controller,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/survey-result/save-survey-result/ports';

import { InvalidParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;

      const error = this.validation.validate(surveyId);
      if (error) {
        return badRequest(error);
      }
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId: accountId!,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
