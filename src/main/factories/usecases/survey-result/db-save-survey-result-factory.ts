import { DbSaveSurveyResult } from '@/application/usecases';
import { SaveSurveyResult } from '@/domain/usecases';
import { SurveyResultMongoRepository } from '@/infrastructure/db';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(
    surveyResultMongoRepository,
    surveyResultMongoRepository,
  );
};
