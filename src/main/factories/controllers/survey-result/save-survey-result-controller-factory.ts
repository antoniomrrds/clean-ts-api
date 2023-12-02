import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeSaveSurveyResultValidation,
  makeDbSaveSurveyResult,
} from '@/main/factories';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { Controller } from '@/presentation/ports';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
