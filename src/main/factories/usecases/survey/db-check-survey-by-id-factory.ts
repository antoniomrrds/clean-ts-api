import { CheckSurveyById } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db';
import { DbCheckSurveyById } from '@/application/usecases';

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbCheckSurveyById(surveyMongoRepository);
};
