import {
  SurveyResultModel,
  LoadSurveyResultRepository,
  LoadSurveyResult,
  LoadSurveyByIdRepository,
} from '@/application/useCases/survey-result/load-survey-result/ports';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult =
      await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId);
    }
    return surveyResult as SurveyResultModel;
  }
}
