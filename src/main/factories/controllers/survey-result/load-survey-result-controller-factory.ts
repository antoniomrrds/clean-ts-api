import {
  makeLogControllerDecorator,
  makeDbCheckSurveyById,
  makeLoadSurveyResultValidation,
  makeDbLoadSurveyResult,
} from '@/main/factories';
import { Controller } from '@/presentation/ports';
import { LoadSurveyResultController } from '@/presentation/controllers';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeLoadSurveyResultValidation(),
    makeDbLoadSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
