/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingParamError } from '@/presentation/errors';
import {
  Validation,
  ValidationComposite,
} from '@/presentation/helpers/validators';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }

  return new ValidationStub();
};

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makesut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makesut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makesut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new Error());
  });
});
