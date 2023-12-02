import { LoadSurveys } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db';
import { DbLoadSurveys } from '@/application/usecases';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
