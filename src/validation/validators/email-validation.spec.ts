import { InvalidParamError } from '@/presentation/errors';
import { EmailValidation } from '@/validation/validators';
import { EmailValidator } from '@/validation/ports';
import { throwError } from '@/domain/test';
import { mockEmailValidator } from '@/validation/test';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any_email@mail.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
  it('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(throwError);
    expect(sut.validate).toThrow();
  });
});
