import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultParams) => Promise<SurveyResultModel>;
}
