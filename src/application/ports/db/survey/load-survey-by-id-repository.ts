import { SurveyModel } from '@/domain/entities';

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyByIdRepository.Result>;
}
export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel | null;
}
