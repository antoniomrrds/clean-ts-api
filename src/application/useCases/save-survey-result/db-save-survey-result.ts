import {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResultModel,
} from '@/application/useCases/save-survey-result/ports';

export class DbSaveSurveyResult implements SaveSurveyResultRepository {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
