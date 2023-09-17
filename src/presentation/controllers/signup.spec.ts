import { SignUpController } from '@/presentation/controllers/signup';

describe('Signup Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        paswordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new Error('Missing param: name'));
  });

  it('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        paswordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new Error('Missing param: email'));
  });
});
