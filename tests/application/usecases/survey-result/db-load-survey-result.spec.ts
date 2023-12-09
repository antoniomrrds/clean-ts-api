import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy,
} from '@/tests/application/mocks';
import { DbLoadSurveyResult } from '@/application/usecases';

import { throwError } from '@/tests/domain/mocks';
import { faker } from '@faker-js/faker';

import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
  );
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
  };
};
let accountId: string;
let surveyId: string;
describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    accountId = faker.string.uuid();
    surveyId = faker.string.uuid();
  });

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId, accountId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });
  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const promise = sut.load(surveyId, accountId);
    await expect(promise).rejects.toThrow();
  });
  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut();
    loadSurveyResultRepositorySpy.result = null!;
    await sut.load(surveyId, accountId);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });
  it('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut();
    loadSurveyResultRepositorySpy.result = null!;
    const surveyResult = await sut.load(surveyId, accountId);
    const { result } = loadSurveyByIdRepositorySpy;
    expect(surveyResult).toEqual({
      surveyId: result.id,
      question: result.question,
      date: result.date,
      answers: result.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false,
      })),
    });
  });
  it('Should return a SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result);
  });
});
