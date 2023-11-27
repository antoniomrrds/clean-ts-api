/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogErrorRepository } from '@/application/ports/db/log';
import { mockLogErrorRepository } from '@/application/test';
import { mockAccountModel } from '@/domain/test';
import { LogControllerDecorator } from '@/main/decorators/log';
import { created, serverError } from '@/presentation/helpers/http';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(created(mockAccountModel()));
    }
  }
  return new ControllerStub();
};
const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = mockLogErrorRepository();
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
    const HttpRequest = mockRequest();
    await sut.handle(HttpRequest);
    expect(handleSpy).toHaveBeenCalledWith(HttpRequest);
  });

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const HttpRequest = mockRequest();
    const httpResponse = await sut.handle(HttpRequest);
    expect(httpResponse).toEqual(created(mockAccountModel()));
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const error = mockServerError();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(error));
    const HttpRequest = mockRequest();
    await sut.handle(HttpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
