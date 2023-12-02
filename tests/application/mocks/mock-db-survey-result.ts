import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports/db';
import { SurveyResultModel } from '@/domain/entities';
import { mockSurveyResultModel } from '@/tests/domain/mocks';
import { SaveSurveyResultParams } from '@/domain/usecases';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  params?: SaveSurveyResultParams;

  async save(surveyData: SaveSurveyResultParams): Promise<void> {
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
  ): Promise<SurveyResultModel | null> {
    this.accountId = accountId;
    this.surveyId = surveyId;
    return Promise.resolve(this.result);
  }
}
