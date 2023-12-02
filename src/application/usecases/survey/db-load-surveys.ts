import { LoadSurveysRepository } from '@/application/ports';
import { SurveyModel } from '@/domain/entities';
import { LoadSurveys } from '@/domain/usecases';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId);
    return surveys;
  }
}
