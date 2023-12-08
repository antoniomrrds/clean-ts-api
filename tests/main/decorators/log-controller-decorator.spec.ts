/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogControllerDecorator } from '@/main/decorators';
import { ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/ports';
import { LogErrorRepositorySpy } from '@/tests/application/mocks';
import { faker } from '@faker-js/faker';

class ControllerSpy implements Controller {
  httpResponse = ok(faker.string.uuid());
  request: any;

  async handle(request: any): Promise<HttpResponse> {
    this.request = request;
    return this.httpResponse;
  }
}

const request = faker.lorem.sentence();

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

type SutTypes = {
  sut: LogControllerDecorator;
  controllerSpy: ControllerSpy;
  logErrorRepositorySpy: LogErrorRepositorySpy;
};

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy,
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut();
    await sut.handle(request);
    expect(controllerSpy.request).toEqual(request);
  });
  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    const serverError = mockServerError();
    controllerSpy.httpResponse = serverError;
    await sut.handle(request);
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack);
  });
});