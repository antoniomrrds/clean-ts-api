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

    const isValid = sut.isValidId('invalidObjectId');

    expect(isValid).toBe(false);
  });
  it('Should return true if MongoHelper.isValidObjectId returns true', () => {
    const sut = makeSut();
    jest.spyOn(MongoHelper, 'isValidObjectId').mockReturnValueOnce(true);

    const isValid = sut.isValidId('validObjectId');

    expect(isValid).toBe(true);
  });
});
