import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result';

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultModel) => Promise<SurveyResultModel>;
}
