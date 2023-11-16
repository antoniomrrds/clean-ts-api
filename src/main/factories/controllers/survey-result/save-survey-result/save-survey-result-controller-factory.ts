import { makeLogControllerDecorator } from '@/main/factories/decorators/log';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/save-survey-result';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result';
import { Controller } from '@/presentation/ports';
import { makeSaveSurveyResultValidation } from '@/main/factories/controllers/survey-result/save-survey-result';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
