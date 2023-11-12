import { AddSurvey } from '@/domain/usecases/survey';
import { DbAddSurvey } from '@/application/useCases/survey/add-survey';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
