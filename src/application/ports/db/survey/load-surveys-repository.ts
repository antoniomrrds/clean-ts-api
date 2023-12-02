import { SurveyModel } from '@/domain/entities';

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<SurveyModel[]>;
}
