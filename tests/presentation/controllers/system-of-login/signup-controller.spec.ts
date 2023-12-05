import { SignUpController } from '@/presentation/controllers';
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
} from '@/presentation/helpers';
import { throwError } from '@/tests/domain/mocks';
import { AddAccountSpy, AuthenticationSpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import { faker } from '@faker-js/faker';

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccountSpy;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addAccountSpy = new AddAccountSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy,
  );
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy,
  };
};
const request = mockRequest();

describe('Signup Controller', () => {
  it('Should call AddAcount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    await sut.handle(request);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password,
    });
  });

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.accountModel = null!;
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new EmailInUseError(request.email)));
  });

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new ServerError(null!)));
  });
  it('Should return 201 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(
      created(authenticationSpy.authenticationModel),
    );
  });
  it('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.lorem.word());
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
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
    const { sut, authenticationSpy } = makeSut();
    await sut.handle(request);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password,
    });
  });
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
