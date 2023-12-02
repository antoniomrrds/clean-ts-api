import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports';
import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyData);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyData.surveyId,
      surveyData.accountId,
    );

    return surveyResult as SurveyResultModel;
  }
}
