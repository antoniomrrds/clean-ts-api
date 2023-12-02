import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeLoadSurveyResultValidation,
  makeDbLoadSurveyResult,
} from '@/main/factories';
import { Controller } from '@/presentation/ports';
import { LoadSurveyResultController } from '@/presentation/controllers';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeLoadSurveyResultValidation(),
    makeDbLoadSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
