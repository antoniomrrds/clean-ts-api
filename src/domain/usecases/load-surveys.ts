import { SurveyModel } from '@/domain/entities';

export interface LoadSurveys {
  load(): Promise<SurveyModel[]>;
}
