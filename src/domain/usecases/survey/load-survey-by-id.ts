import { SurveyModel } from '@/domain/entities';

export interface LoadSurveyById {
  loadById(id: string): Promise<LoadSurveyById.Result>;
}
export namespace LoadSurveyById {
  export type Result = SurveyModel;
}
