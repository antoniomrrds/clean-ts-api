import { SurveyModel } from '@/domain/entities';

export type AddSurveyParams = Omit<SurveyModel, 'id'>;

export interface AddSurvey {
  add(surveyData: AddSurveyParams): Promise<void>;
}
