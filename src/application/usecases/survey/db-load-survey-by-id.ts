import { LoadSurveyByIdRepository } from '@/application/ports';
import { SurveyModel } from '@/domain/entities';
import { LoadSurveyById } from '@/domain/usecases';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
