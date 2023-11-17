import { MissingParamError } from '@/presentation/errors';
import { ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/ports';
import { mockValidation } from '@/validation/test';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makesut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
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

  it('should not return if validation succeeds', () => {
    const { sut } = makesut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
