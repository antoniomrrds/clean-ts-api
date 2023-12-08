import { AuthMiddleware } from '@/presentation/middlewares';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { throwError } from '@/tests/domain/mocks';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenSpy: LoadAccountByTokenSpy;
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);
  return {
    sut,
    loadAccountByTokenSpy,
  };
};

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token',
});
const request = mockRequest();
describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in hearders', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenSpy } = makeSut(role);
    await sut.handle(request);
    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken);
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.result = null!;
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(
      ok({
        accountId: loadAccountByTokenSpy.result.id,
      }),
    );
  });

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest
      .spyOn(loadAccountByTokenSpy, 'load')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error('any_token')));
  });
});
