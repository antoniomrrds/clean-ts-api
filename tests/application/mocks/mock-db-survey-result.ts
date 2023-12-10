import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports/db';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  params?: SaveSurveyResultRepository.Params;

  async save(surveyData: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = surveyData;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  surveyId?: string;
  accountId?: string;
  result = mockSurveyResultModel();
  async loadBySurveyId(
    surveyId: string,
    accountId: string,
  ): Promise<LoadSurveyResultRepository.Result> {
    this.accountId = accountId;
    this.surveyId = surveyId;
    return this.result;
  }
}
