import { Controller } from '@/presentation/ports';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey';
import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );
  return makeLogControllerDecorator(controller);
};
