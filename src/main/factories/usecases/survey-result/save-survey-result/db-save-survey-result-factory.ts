import { DbSaveSurveyResult } from '@/application/useCases/survey-result/save-survey-result';
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultMongoRepository } from '@/infrastructure/db/mongodb/survey-result';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(
    surveyResultMongoRepository,
    surveyResultMongoRepository,
  );
};
