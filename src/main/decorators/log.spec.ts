/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogErrorRepository } from '@/application/ports/db';
import { AccountModel } from '@/domain/entities';
import { LogControllerDecorator } from '@/main/decorators';
import { created, serverError } from '@/presentation/helpers/http';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(created(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};
const makeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
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
    const HttpRequest = makeFakeRequest();
    await sut.handle(HttpRequest);
    expect(handleSpy).toHaveBeenCalledWith(HttpRequest);
  });

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const HttpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(HttpRequest);
    expect(httpResponse).toEqual(created(makeFakeAccount()));
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const error = makeServerError();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)));
    const HttpRequest = makeFakeRequest();
    await sut.handle(HttpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
