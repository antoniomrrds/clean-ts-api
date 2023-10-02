/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSignUpValidation } from '@/main/factories';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '@/presentation/helpers/validators';
import { EmailValidator } from '@/presentation/ports/email-validator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

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
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
