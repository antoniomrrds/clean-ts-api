import { LoadSurveys } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { DbLoadSurveys } from '@/application/useCases/load-surveys';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
