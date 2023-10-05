import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from '@/presentation/helpers/validators';

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
