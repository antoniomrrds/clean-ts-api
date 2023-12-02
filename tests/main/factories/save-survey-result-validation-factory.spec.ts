import { makeSaveSurveyResultValidation } from '@/main/factories';
import {
  IdParamValidation,
  ValidationComposite,
} from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { MongoIdValidatorAdapter } from '@/infrastructure/validators';

jest.mock('@/validation/validators/validation-composite');

describe('SaveSurveyResultValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyResultValidation();
    const validations: Validation[] = [];

    validations.push(
      new IdParamValidation('surveyId', new MongoIdValidatorAdapter()),
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
