/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSignUpValidation } from '@/main/factories';
import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '@/presentation/helpers/validators';

jest.mock('@/presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
