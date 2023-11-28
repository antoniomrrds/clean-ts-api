import { DbLoadSurveyResult } from '@/application/useCases/survey-result/load-survey-result';
import { LoadSurveyResult } from '@/domain/usecases/survey-result';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { SurveyResultMongoRepository } from '@/infrastructure/db/mongodb/survey-result';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository,
  );
};
