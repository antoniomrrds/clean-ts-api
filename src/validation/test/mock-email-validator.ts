/* eslint-disable @typescript-eslint/no-unused-vars */

import { EmailValidator } from '@/validation/ports';

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
