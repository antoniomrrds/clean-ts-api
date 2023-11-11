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
    const surveyResult = await this.saveSurveyResultRepository.save(surveyData);
    return surveyResult;
  }
}
