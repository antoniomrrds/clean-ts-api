/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogControllerDecorator } from '@/decorators';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
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
    const contrtollerStub = new ControllerStub();
    const handleSpy = jest.spyOn(contrtollerStub, 'handle');
    const sut = new LogControllerDecorator(contrtollerStub);
    const HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(HttpRequest);
    expect(contrtollerStub.handle).toHaveBeenCalledWith(HttpRequest);
  });
});
