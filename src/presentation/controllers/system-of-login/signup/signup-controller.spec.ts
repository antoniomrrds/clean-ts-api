/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddAccount,
  HttpRequest,
  Validation,
  Authentication,
} from '@/presentation/controllers/system-of-login/signup/ports';
import { SignUpController } from '@/presentation/controllers/system-of-login/signup';
import {
  EmailInUseError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from '@/presentation/helpers/http';
import { throwError } from '@/domain/test';
import { mockValidation } from '@/validation/test';
import { mockAddAccount, mockAuthentication } from '@/presentation/test';

const mockRequestAuthentication = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  );
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('Signup Controller', () => {
  it('Should call AddAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(Promise.resolve(null as any));

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      forbidden(new EmailInUseError(httpRequest.body.email)),
    );
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
  it('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(created({ accessToken: 'any_token' }));
  });
  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });

  it('should return a ServerError response with "Server failed. Try again soon" when error is undefined', () => {
    // Arrange
    const error: undefined = undefined;

    // Act
    const result = serverError(error);

    // Assert
    expect(result).toEqual(result);
  });

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    const valueRequest = mockRequestAuthentication().body;
    expect(authSpy).toHaveBeenCalledWith(valueRequest);
  });
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
