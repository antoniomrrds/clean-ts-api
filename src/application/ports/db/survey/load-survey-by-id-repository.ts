import { SurveyModel } from '@/domain/entities';

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>;
}
