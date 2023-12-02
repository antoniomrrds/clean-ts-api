import { AuthMiddleware } from '@/presentation/middlewares';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks';
import { HttpRequest } from '@/presentation/ports';
import { throwError } from '@/tests/domain/mocks';

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

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});
let httpRequest: HttpRequest;
describe('Auth Middleware', () => {
  beforeEach(() => {
    httpRequest = mockRequest();
  });
  it('Should return 403 if no x-access-token exists in hearders', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenSpy } = makeSut(role);
    await sut.handle(httpRequest);
    expect(loadAccountByTokenSpy.accessToken).toBe(
      httpRequest.headers['x-access-token'],
    );
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.accountModel = null!;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      ok({
        accountId: loadAccountByTokenSpy.accountModel.id,
      }),
    );
  });

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest
      .spyOn(loadAccountByTokenSpy, 'load')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error('any_token')));
  });
});
