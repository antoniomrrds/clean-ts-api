/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const sut = new IdParamValidation(objectIdValidatorStub);
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
});
