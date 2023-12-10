import { LoginController } from '@/presentation/controllers';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import { throwError } from '@/tests/domain/mocks';
import { AuthenticationSpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import { faker } from '@faker-js/faker';

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

type sutTypes = {
  sut: LoginController;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): sutTypes => {
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return {
    sut,
    authenticationSpy,
    validationSpy,
  };
};
const request = mockRequest();

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    await sut.handle(request);
    expect(authenticationSpy.Params).toEqual({
      email: request.email,
      password: request.password,
    });
  });
  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.result = null!;
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(unauthorized());
  });
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(authenticationSpy.result));
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
});
