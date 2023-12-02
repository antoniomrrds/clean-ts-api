import { HttpRequest } from '@/presentation/ports';
import { faker } from '@faker-js/faker';
import { LoadSurveysController } from '@/presentation/controllers';
import { LoadSurveysSpy } from '@/tests/presentation/mocks';
import { throwError } from '@/tests/domain/mocks';
import { noContent, ok, serverError } from '@/presentation/helpers';
import MockDate from 'mockdate';

const mockRequest = (): HttpRequest => ({ accountId: faker.string.uuid() });

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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId);
  });
  it('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels));
  });
  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.surveyModels = [];
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
  it('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
