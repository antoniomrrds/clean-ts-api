import {
  IdParamValidation,
  ValidationComposite,
} from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { MongoIdValidatorAdapter } from '@/infrastructure/validators';
import { makeLoadSurveyResultValidation } from '@/main/factories';

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
