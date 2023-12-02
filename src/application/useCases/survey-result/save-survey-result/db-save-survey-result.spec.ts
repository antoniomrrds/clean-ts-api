import { DbSaveSurveyResult } from '@/application/useCases/survey-result/save-survey-result';
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/useCases/survey-result/save-survey-result/ports';
import {
  mockSurveyResultModel,
  mockSaveSurveyResultParams,
  throwError,
} from '@/domain/test';
import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository,
} from '@/application/test';

import MockDate from 'mockdate';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  describe('save()', () => {
    it('Should call SaveSurveyResultRepository with correct values', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut();
      const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
      await sut.save(mockSaveSurveyResultParams());
      expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams());
    });
    it('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut();
      jest
        .spyOn(saveSurveyResultRepositoryStub, 'save')
        .mockImplementationOnce(throwError);
      const promise = sut.save(mockSaveSurveyResultParams());
      await expect(promise).rejects.toThrow();
    });

    it('Should call LoadSurveyResultRepository with correct values', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut();
      const loadBySurveyIdSpy = jest.spyOn(
        loadSurveyResultRepositoryStub,
        'loadBySurveyId',
      );
      await sut.save(mockSaveSurveyResultParams());
      expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
        mockSaveSurveyResultParams().surveyId,
        mockSaveSurveyResultParams().accountId,
      );
    });
    it('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut();
      jest
        .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockImplementationOnce(throwError);
      const promise = sut.save(mockSaveSurveyResultParams());
      await expect(promise).rejects.toThrow();
    });
    it('Should return a SurveyResult on success', async () => {
      const { sut } = makeSut();
      const surveyResult = await sut.save(mockSaveSurveyResultParams());
      expect(surveyResult).toEqual(mockSurveyResultModel());
    });
  });
});
