import { makeSignUpValidation } from '@/main/factories/controllers/system-of-login/signup';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { mockEmailValidator } from '@/validation/test';

jest.mock('@/validation/validators/validation-composite');

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
    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
