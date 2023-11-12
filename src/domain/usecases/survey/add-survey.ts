import { SurveyModel } from '@/domain/entities';

export type AddSurveyModel = Omit<SurveyModel, 'id'>;

export interface AddSurvey {
  add(surveyData: AddSurveyModel): Promise<void>;
}
