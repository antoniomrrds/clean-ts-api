import { LoginController } from '@/presentation/controllers/login';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';

type sutTypes = {
  sut: LoginController;
};

const makeSut = (): sutTypes => {
  const sut = new LoginController();
  return {
    sut,
  };
};

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyemail@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
