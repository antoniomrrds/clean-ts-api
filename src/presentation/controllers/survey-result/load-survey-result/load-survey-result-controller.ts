import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  Validation,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers/http';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;

      this.validation.validate(surveyId);
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    } catch (error) {
      return serverError(error);
    }
  }
}
