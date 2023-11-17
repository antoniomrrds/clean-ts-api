import {
  SurveyResultModel,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SaveSurveyResult,
} from '@/application/useCases/survey-result/save-survey-result/ports';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(surveyData);
    return surveyResult;
  }
}
