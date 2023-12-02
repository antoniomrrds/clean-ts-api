import { DbLoadSurveyResult } from '@/application/useCases/survey-result/load-survey-result';
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository,
  HttpRequest,
} from '@/application/useCases/survey-result/load-survey-result/ports';
import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository,
} from '@/application/test';
import {
  mockSurveyResultModel,
  mockSurveyResultEmpty,
  throwError,
} from '@/domain/test';

import MockDate from 'mockdate';

const mockRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: {
    surveyId: 'any_survey_id',
  },
});

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  );
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    const httpRequest = mockRequest();

    await sut.load(httpRequest.params.surveyId, httpRequest.accountId!);
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      httpRequest.params.surveyId,
      httpRequest.accountId!,
    );
  });
  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const httpRequest = mockRequest();
    const promise = sut.load(
      httpRequest.params.surveyId,
      httpRequest.accountId!,
    );
    await expect(promise).rejects.toThrow();
  });
  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest = mockRequest();
    await sut.load(httpRequest.params.surveyId, httpRequest.accountId!);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });
  it('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRequest = mockRequest();
    const surveyResult = await sut.load(
      httpRequest.params.surveyId,
      httpRequest.accountId!,
    );
    expect(surveyResult).toEqual(mockSurveyResultEmpty());
  });
  it('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    const surveyResult = await sut.load(
      httpRequest.params.surveyId,
      httpRequest.accountId!,
    );
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
