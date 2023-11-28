import { makeLogControllerDecorator } from '@/main/factories/decorators/log';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id';
import { Controller } from '@/presentation/ports';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result';
import { makeLoadSurveyResultValidation } from '@/main/factories/controllers/survey-result/load-survey-result';
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeLoadSurveyResultValidation(),
    makeDbLoadSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
