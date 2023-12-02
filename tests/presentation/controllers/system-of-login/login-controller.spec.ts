import { LoginController } from '@/presentation/controllers';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import { HttpRequest } from '@/presentation/ports';
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks';
import { AuthenticationSpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import { faker } from '@faker-js/faker';

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams(),
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
let httpRequest: HttpRequest;

describe('Login Controller', () => {
  beforeEach(() => {
    httpRequest = mockRequest();
  });
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    await sut.handle(httpRequest);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel = null!;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel));
  });

  it('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.lorem.word());
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
