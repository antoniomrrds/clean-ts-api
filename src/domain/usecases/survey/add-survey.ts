import { SurveyModel } from '@/domain/entities';
export interface AddSurvey {
  add(surveyData: AddSurvey.Params): Promise<void>;
}
export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>;
}
