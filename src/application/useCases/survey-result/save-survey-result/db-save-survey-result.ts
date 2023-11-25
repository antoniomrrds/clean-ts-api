import {
  SurveyResultModel,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SaveSurveyResult,
  LoadSurveyResultRepository,
} from '@/application/useCases/survey-result/save-survey-result/ports';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyData);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyData.surveyId,
    );

    return surveyResult as SurveyResultModel;
  }
}
