import { LoadSurveys } from '@/domain/usecases';
import { LoadSurveysRepository } from '@/application/ports/db/survey';
import { SurveyModel } from '@/domain/entities';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();
    return [];
  }
}
