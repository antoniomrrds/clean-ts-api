import { AddSurvey } from '@/domain/usecases';
import { DbAddSurvey } from '@/application/useCases/add-survey';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
