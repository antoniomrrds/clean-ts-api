import { makeLoginValidation } from '@/main/factories/controllers/system-of-login/login';
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { mockEmailValidator } from '@/validation/test';

jest.mock('@/validation/validators/validation-composite');

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
