import {
  SurveyResultModel,
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SaveSurveyResult,
} from '@/application/useCases/save-survey-result/ports';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
