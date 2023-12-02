import {
  SurveyModel,
  LoadSurveys,
  LoadSurveysRepository,
} from '@/application/useCases/survey/load-surveys/ports';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);
    return surveys;
  }
}
