/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogControllerDecorator } from '@/main/decorators';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        },
      };
      return new Promise(resolve => resolve(HttpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(HttpRequest);
    expect(controllerStub.handle).toHaveBeenCalledWith(HttpRequest);
  });
});