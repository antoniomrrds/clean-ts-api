import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/save-survey-result/ports';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
