import { SurveyResultModel } from '@/domain/entities';

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel | null>;
}
