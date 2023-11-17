import { throwError } from '@/domain/test';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { MongoIdValidatorAdapter } from '@/infrastructure/db/mongodb/validation/validators';

jest.mock('@/infrastructure/db/mongodb/helpers');

const makeSut = (): MongoIdValidatorAdapter => {
  return new MongoIdValidatorAdapter();
};

describe('MongoIdValidator Adapter', () => {
  it('Should return false if MongoHelper.isValidObjectId returns false', () => {
    const sut = makeSut();
    jest.spyOn(MongoHelper, 'isValidObjectId').mockReturnValueOnce(false);

    const isValid = sut.isValidId('invalid_Id');

    expect(isValid).toBe(false);
  });
  it('Should return true if MongoHelper.isValidObjectId returns true', () => {
    const sut = makeSut();
    jest.spyOn(MongoHelper, 'isValidObjectId').mockReturnValueOnce(true);

    const isValid = sut.isValidId('valid_id');

    expect(isValid).toBe(true);
  });
  it('Should call MongoHelper.isValidObjectId with correct id', () => {
    const sut = makeSut();
    const isValidObjectIdSpy = jest.spyOn(MongoHelper, 'isValidObjectId');

    sut.isValidId('any_id');

    expect(isValidObjectIdSpy).toHaveBeenCalledWith('any_id');
  });
  it('Should return false if MongoHelper.isValidObjectId throws an error', () => {
    const sut = makeSut();
    jest
      .spyOn(MongoHelper, 'isValidObjectId')
      .mockImplementationOnce(throwError);

    const isValid = sut.isValidId('any_id');

    expect(isValid).toBe(false);
  });
});
