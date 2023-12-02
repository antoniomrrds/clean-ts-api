import { SurveyModel } from '@/domain/entities';

export interface LoadSurveys {
  load(accountId: string): Promise<SurveyModel[]>;
}
