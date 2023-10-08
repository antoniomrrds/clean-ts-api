import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/helpers/validators';
import { EmailValidatorAdapter } from '@/main/adapters/validators';

export const makeLoginValidation = (): ValidationComposite => {
  const validations = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
