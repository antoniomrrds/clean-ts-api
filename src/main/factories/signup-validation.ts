import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );
  return new ValidationComposite(validations);
};
