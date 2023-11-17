import { LoadSurveysRepository } from '@/application/useCases/survey/load-surveys/ports';

import { DbLoadSurveys } from '@/application/useCases/survey/load-surveys';
import MockDate from 'mockdate';
import { mockSurveysModels, throwError } from '@/domain/test';
import { mockLoadSurveysRepository } from '@/application/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};
describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
  it('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(mockSurveysModels());
  });
  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(throwError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
