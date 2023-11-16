import { MongoIdValidatorAdapter } from '@/infrastructure/db/mongodb/validation/validators';
import {
  IdParamValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeSaveSurveyResultValidation = (): ValidationComposite => {
  const validations = [];
  validations.push(
    new IdParamValidation('surveyId', new MongoIdValidatorAdapter()),
  );

  return new ValidationComposite(validations);
};
