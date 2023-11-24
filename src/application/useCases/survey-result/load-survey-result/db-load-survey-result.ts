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
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
