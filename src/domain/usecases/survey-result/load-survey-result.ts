import { SurveyResultModel } from '@/domain/entities';

export interface LoadSurveyResult {
  load(surveyId: string): Promise<SurveyResultModel>;
}
