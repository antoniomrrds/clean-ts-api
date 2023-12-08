import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/ports';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly checkSurveyById: CheckSurveyById,
    private readonly validation: Validation,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}
  async handle(
    request: LoadSurveyResultController.Request,
  ): Promise<HttpResponse> {
    try {
      const { surveyId } = request;

      const error = this.validation.validate(surveyId);
      if (error) {
        return badRequest(error);
      }

      const exists = await this.checkSurveyById.checkById(surveyId);
      if (!exists) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        request.accountId,
      );

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  };
}
