import { Controller } from '@/presentation/ports';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys';
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-surveys';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
