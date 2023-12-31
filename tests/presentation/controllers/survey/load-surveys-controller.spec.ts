import { LoadSurveysController } from '@/presentation/controllers';
import { noContent, ok, serverError } from '@/presentation/helpers';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { throwError } from '@/tests/domain/mocks';
import { LoadSurveysSpy } from '@/tests/presentation/mocks';

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.string.uuid(),
});

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);
  return {
    sut,
    loadSurveysSpy,
  };
};
const request = mockRequest();

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpRequest = request;
    await sut.handle(httpRequest);
    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId);
  });
  it('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result));
  });
  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.result = [];
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
  });
  it('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
