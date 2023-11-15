/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidParamError } from '@/presentation/errors';
import { ObjectIdValidator } from '@/validation/ports';
import { IdParamValidation } from '@/validation/validators';

const makeObjectIdValidator = (): ObjectIdValidator => {
  class ObjectIdValidatorStub implements ObjectIdValidator {
    isValidObjectId(id: string): boolean {
      return true;
    }
  }
  return new ObjectIdValidatorStub();
};

type SutTypes = {
  sut: IdParamValidation;
  objectIdValidatorStub: ObjectIdValidator;
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
  it('should call ObjectIdValidator with correct id', () => {
    const { sut, objectIdValidatorStub } = makeSut();
    const isValidObjectIdSpy = jest.spyOn(
      objectIdValidatorStub,
      'isValidObjectId',
    );

    sut.validate('any_id');
    expect(isValidObjectIdSpy).toHaveBeenCalledWith('any_id');
  });
  it('should return an error if ObjectIdValidator returns false', () => {
    const { sut, objectIdValidatorStub } = makeSut();
    jest
      .spyOn(objectIdValidatorStub, 'isValidObjectId')
      .mockReturnValueOnce(false);
    const error = sut.validate('invalid_id');
    expect(error).toEqual(new InvalidParamError('fieldId'));
  });
});
