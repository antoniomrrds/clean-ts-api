import { MongoIdValidatorAdapter } from '@/infrastructure/validators';
import {
  IdParamValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeLoadSurveyResultValidation = (): ValidationComposite => {
  const validations = [];
  validations.push(
    new IdParamValidation('surveyId', new MongoIdValidatorAdapter()),
  );

  return new ValidationComposite(validations);
};
