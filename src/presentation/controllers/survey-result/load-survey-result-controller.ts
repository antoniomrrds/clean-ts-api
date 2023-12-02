import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/ports';

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
      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        httpRequest.accountId!,
      );

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
