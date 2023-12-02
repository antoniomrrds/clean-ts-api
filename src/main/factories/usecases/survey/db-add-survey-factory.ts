import { AddSurvey } from '@/domain/usecases';
import { DbAddSurvey } from '@/application/usecases';
import { SurveyMongoRepository } from '@/infrastructure/db';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
