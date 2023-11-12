import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  Controller,
  HttpResponse,
} from '@/presentation/controllers/survey-result/save-survey-result/ports';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map(a => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
      await this.saveSurveyResult.save({
        surveyId,
        accountId: accountId!,
        answer,
        date: new Date(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    } catch (error) {
      return serverError(error);
    }
  }
}
