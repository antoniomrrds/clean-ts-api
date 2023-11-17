/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validation } from '@/presentation/ports';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }

  return new ValidationStub();
};
