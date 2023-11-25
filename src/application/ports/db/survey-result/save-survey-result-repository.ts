import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultParams) => Promise<void>;
}
