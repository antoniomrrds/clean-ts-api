import { mockSurveysModels, throwError } from '@/domain/test';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys';
import { LoadSurveys } from '@/presentation/controllers/survey/load-surveys/ports';
import { noContent, ok, serverError } from '@/presentation/helpers/http';
import { mockLoadSurveys } from '@/presentation/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('Should call LoadSurveys', () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
  it('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(mockSurveysModels()));
  });
  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest
      .spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });
  it('Should throw if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
