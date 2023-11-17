/* eslint-disable @typescript-eslint/no-unused-vars */

import { IdValidator } from '@/validation/ports';

export const mockIdValidator = (): IdValidator => {
  class IdValidatorStub implements IdValidator {
    isValidId(id: string): boolean {
      return true;
    }
  }
  return new IdValidatorStub();
};
