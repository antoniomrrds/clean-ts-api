import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from '@/validation/validators';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};

describe('CompareField Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'wrong_name',
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });
    expect(error).toBeFalsy();
  });
});
