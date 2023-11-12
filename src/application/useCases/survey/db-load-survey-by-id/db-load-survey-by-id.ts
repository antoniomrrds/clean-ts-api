import {
  LoadSurveyByIdRepository,
  SurveyModel,
  LoadSurveyById,
} from '@/application/useCases/survey/db-load-survey-by-id/ports';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
