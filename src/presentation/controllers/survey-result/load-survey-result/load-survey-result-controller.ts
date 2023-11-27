import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId,
      );
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Promise.resolve(null as any);
    } catch (error) {
      return serverError(error);
    }
  }
}
