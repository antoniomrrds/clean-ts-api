/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidParamError } from '@/presentation/errors';
import { IdValidator } from '@/validation/ports';
import { IdParamValidation } from '@/validation/validators';

const makeObjectIdValidator = (): IdValidator => {
  class IdValidatorStub implements IdValidator {
    isValidId(id: string): boolean {
      return true;
    }
  }
  return new IdValidatorStub();
};

type SutTypes = {
  sut: IdParamValidation;
  objectIdValidatorStub: IdValidator;
};

const makeSut = (): SutTypes => {
  const objectIdValidatorStub = makeObjectIdValidator();
  const sut = new IdParamValidation('fieldId', objectIdValidatorStub);
  return {
    sut,
    objectIdValidatorStub,
  };
};

describe('IdParam Validation', () => {
  it('should call IdValidator with correct id', () => {
    const { sut, objectIdValidatorStub } = makeSut();
    const isValidObjectIdSpy = jest.spyOn(objectIdValidatorStub, 'isValidId');

    sut.validate('any_id');
    expect(isValidObjectIdSpy).toHaveBeenCalledWith('any_id');
  });
  it('should return an error if IdValidator returns false', () => {
    const { sut, objectIdValidatorStub } = makeSut();
    jest.spyOn(objectIdValidatorStub, 'isValidId').mockReturnValueOnce(false);
    const error = sut.validate('invalid_id');
    expect(error).toEqual(new InvalidParamError('fieldId'));
  });
});
