import { Controller } from '@/presentation/ports';
import { LoadSurveysController } from '@/presentation/controllers';
import {
  makeDbLoadSurveys,
  makeLogControllerDecorator,
} from '@/main/factories';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
