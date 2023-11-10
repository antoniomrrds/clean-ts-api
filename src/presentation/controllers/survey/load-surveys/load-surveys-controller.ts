/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
} from '@/presentation/controllers/survey/load-surveys/ports';
import { ok } from '@/presentation/helpers/http';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return ok(surveys);
  }
}
