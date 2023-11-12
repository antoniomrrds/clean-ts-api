import { LoadSurveyById } from '@/domain/usecases/survey';
import { SurveyMongoRepository } from '@/infrastructure/db/mongodb/survey';
import { DbLoadSurveyById } from '@/application/useCases/survey/db-load-survey-by-id';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
