import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel();
  Params?: SaveSurveyResult.Params;

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.Params = data;
    return this.result;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel();
  surveyId?: string;
  accountId?: string;

  async load(
    surveyId: string,
    accountId: string,
  ): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return this.result;
  }
}
