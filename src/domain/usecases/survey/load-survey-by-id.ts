import { SurveyModel } from '@/domain/entities';

export interface LoadSurveyById {
  loadById(id: string): Promise<SurveyModel>;
}
