import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports';
import { SaveSurveyResult } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(
    surveyData: SaveSurveyResult.Params,
  ): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(surveyData);
    return this.loadSurveyResultRepository.loadBySurveyId(
      surveyData.surveyId,
      surveyData.accountId,
    );
  }
}
