import { SurveyModel } from '@/domain/entities';

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>;
}
