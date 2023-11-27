import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult,
  Validation,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  serverError,
} from '@/presentation/helpers/http';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly validation: Validation,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;

      const error = this.validation.validate(surveyId);
      if (error) {
        return badRequest(error);
      }

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      await this.loadSurveyResult.load(surveyId);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    } catch (error) {
      return serverError(error);
    }
  }
}
