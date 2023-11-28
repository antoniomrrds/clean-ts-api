import {
  IdParamValidation,
  ValidationComposite,
} from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { MongoIdValidatorAdapter } from '@/infrastructure/db/mongodb/validation/validators';
import { makeLoadSurveyResultValidation } from '@/main/factories/controllers/survey-result/load-survey-result';

jest.mock('@/validation/validators/validation-composite');

describe('LoadSurveyResultValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoadSurveyResultValidation();
    const validations: Validation[] = [];

    validations.push(
      new IdParamValidation('surveyId', new MongoIdValidatorAdapter()),
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
