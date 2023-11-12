import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/save-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyResult = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId,
      );
      if (!surveyResult) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    } catch (error) {
      return serverError(error);
    }
  }
}
