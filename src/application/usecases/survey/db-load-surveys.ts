import { LoadSurveysRepository } from '@/application/ports';
import { LoadSurveys } from '@/domain/usecases';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<LoadSurveys.Result> {
    return this.loadSurveysRepository.loadAll(accountId);
  }
}
