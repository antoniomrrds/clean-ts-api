import {
  SurveyResultModel,
  LoadSurveyResultRepository,
  LoadSurveyResult,
} from '@/application/useCases/survey-result/load-survey-result/ports';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult =
      await this.loadSurveyResultRepository.loadBySurveyId(surveyId);

    return surveyResult;
  }
}
