/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '@/presentation/errors';
import {
  Validation,
  ValidationComposite,
} from '@/presentation/helpers/validators';

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    class ValidationSpy implements Validation {
      validate(input: any): Error {
        return new MissingParamError('field');
      }
    }
    const validationSpy = new ValidationSpy();
    const sut = new ValidationComposite([validationSpy]);
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
