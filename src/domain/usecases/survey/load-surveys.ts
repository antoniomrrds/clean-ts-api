import { SurveyModel } from '@/domain/entities';

export interface LoadSurveys {
  load(accountId: string): Promise<LoadSurveys.Result>;
}
export namespace LoadSurveys {
  export type Result = SurveyModel[];
}
