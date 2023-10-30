import { Controller } from '@/presentation/ports';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey';
import { makeAddSurveyValidation } from '@/main/factories/controllers/add-survey';
import { makeDbAddSurvey } from '@/main/factories/usecases/add-survey';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );
  return makeLogControllerDecorator(controller);
};
