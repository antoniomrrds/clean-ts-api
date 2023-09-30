/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogErrorRepository } from '@/application/ports';
import { LogControllerDecorator } from '@/main/decorators';
import { serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

const fakeRequest = {
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const HttpResponse = {
        statusCode: 200,
        ...fakeRequest,
      };
      return new Promise(resolve => resolve(HttpResponse));
    }
  }
  return new ControllerStub();
};
const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository();
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const HttpRequest = fakeRequest;
    await sut.handle(HttpRequest);
    expect(controllerStub.handle).toHaveBeenCalledWith(HttpRequest);
  });

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const HttpRequest = fakeRequest;
    const httpResponse = await sut.handle(HttpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      ...fakeRequest,
    });
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)));
    const HttpRequest = fakeRequest;
    await sut.handle(HttpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
