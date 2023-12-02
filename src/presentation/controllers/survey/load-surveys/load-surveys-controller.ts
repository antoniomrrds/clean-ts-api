import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
} from '@/presentation/controllers/survey/load-surveys/ports';
import { noContent, ok, serverError } from '@/presentation/helpers/http';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId!);
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
