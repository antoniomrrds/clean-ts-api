import { LoadAnswersBySurvey } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db';
import { DbLoadAnswersBySurvey } from '@/application/usecases';

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadAnswersBySurvey(surveyMongoRepository);
};
