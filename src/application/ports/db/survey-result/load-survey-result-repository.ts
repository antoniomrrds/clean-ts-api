import { SurveyResultModel } from '@/domain/entities';

export interface LoadSurveyResultRepository {
  loadBySurveyId: (
    surveyId: string,
    accountId: string,
  ) => Promise<SurveyResultModel | null>;
}
