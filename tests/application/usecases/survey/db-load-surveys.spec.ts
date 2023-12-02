import { DbLoadSurveys } from '@/application/usecases';
import { throwError } from '@/tests/domain/mocks';
import { LoadSurveysRepositorySpy } from '@/tests/application/mocks';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

let accountId: string;

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    accountId = faker.string.uuid();
  });
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    await sut.load(accountId);
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });
  it('should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load(accountId);
    expect(surveys).toEqual(loadSurveysRepositorySpy.result);
  });
  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);
    const promise = sut.load(accountId);
    await expect(promise).rejects.toThrow();
  });
});
