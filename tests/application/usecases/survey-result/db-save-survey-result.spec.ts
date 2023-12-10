import { DbSaveSurveyResult } from '@/application/usecases';
import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy,
} from '@/tests/application/mocks';

import { mockSaveSurveyResultParams, throwError } from '@/tests/domain/mocks';

import MockDate from 'mockdate';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  );
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  };
};
const surveyResultData = mockSaveSurveyResultParams();
describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  describe('save()', () => {
    it('Should call SaveSurveyResultRepository with correct values', async () => {
      const { sut, saveSurveyResultRepositorySpy } = makeSut();
      await sut.save(surveyResultData);
      expect(saveSurveyResultRepositorySpy.params).toEqual(surveyResultData);
    });
    it('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositorySpy } = makeSut();
      jest
        .spyOn(saveSurveyResultRepositorySpy, 'save')
        .mockImplementationOnce(throwError);
      const promise = sut.save(surveyResultData);
      await expect(promise).rejects.toThrow();
    });

    it('Should call LoadSurveyResultRepository with correct values', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut();

      await sut.save(surveyResultData);
      expect(loadSurveyResultRepositorySpy.surveyId).toBe(
        surveyResultData.surveyId,
      );
      expect(loadSurveyResultRepositorySpy.accountId).toBe(
        surveyResultData.accountId,
      );
    });
    it('Should throw if LoadSurveyResultRepository throws', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut();
      jest
        .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
        .mockImplementationOnce(throwError);
      const promise = sut.save(mockSaveSurveyResultParams());
      await expect(promise).rejects.toThrow();
    });
    it('Should return a SurveyResult on success', async () => {
      const { sut, loadSurveyResultRepositorySpy } = makeSut();
      const surveyResult = await sut.save(mockSaveSurveyResultParams());
      expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result);
    });
  });
});
