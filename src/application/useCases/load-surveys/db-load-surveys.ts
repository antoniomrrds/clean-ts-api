import {
  SurveyModel,
  LoadSurveysRepository,
  LoadSurveys,
} from '@/application/useCases/load-surveys/ports';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}
