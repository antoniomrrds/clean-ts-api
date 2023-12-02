import { LoadSurveyById } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db';
import { DbLoadSurveyById } from '@/application/usecases';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
