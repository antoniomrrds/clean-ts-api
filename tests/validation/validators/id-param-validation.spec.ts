import { InvalidParamError } from '@/presentation/errors';
import { IdValidator } from '@/validation/ports';
import { mockIdValidator } from '@/tests/validation/mocks';
import { IdParamValidation } from '@/validation/validators';

type SutTypes = {
  sut: IdParamValidation;
  idValidatorStub: IdValidator;
};

const makeSut = (): SutTypes => {
  const idValidatorStub = mockIdValidator();
  const sut = new IdParamValidation('fieldId', idValidatorStub);
  return {
    sut,
    idValidatorStub,
  };
};

describe('IdParam Validation', () => {
  it('should call IdValidator with correct id', () => {
    const { sut, idValidatorStub } = makeSut();
    const isValidObjectIdSpy = jest.spyOn(idValidatorStub, 'isValidId');

    sut.validate('any_id');
    expect(isValidObjectIdSpy).toHaveBeenCalledWith('any_id');
  });
  it('should return an error if IdValidator returns false', () => {
    const { sut, idValidatorStub } = makeSut();
    jest.spyOn(idValidatorStub, 'isValidId').mockReturnValueOnce(false);
    const error = sut.validate('invalid_id');
    expect(error).toEqual(new InvalidParamError('fieldId'));
  });
  it('should not return if IdValidator returns true', () => {
    const { sut } = makeSut();
    const error = sut.validate('valid_id');
    expect(error).toBeFalsy();
  });
});
