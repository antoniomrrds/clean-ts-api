import { DbSaveSurveyResult } from '@/application/useCases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '@/application/useCases/survey-result/save-survey-result/ports';
import {
  mockSaveSurveyResultModel,
  mockSaveSurveyResultParams,
  throwError,
} from '@/domain/test';
import { mockSaveSurveyResultRepository } from '@/application/test';

import MockDate from 'mockdate';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub,
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
      await sut.save(mockSaveSurveyResultModel());
      expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultModel());
    });
    it('Should throw if SaveSurveyResultRepository throws', async () => {
      const { sut, saveSurveyResultRepositoryStub } = makeSut();
      jest
        .spyOn(saveSurveyResultRepositoryStub, 'save')
        .mockImplementationOnce(throwError);
      const promise = sut.save(mockSaveSurveyResultModel());
      await expect(promise).rejects.toThrow();
    });

    it('Should return a SurveyResult on success', async () => {
      const { sut } = makeSut();
      const surveyResult = await sut.save(mockSaveSurveyResultParams());
      expect(surveyResult).toEqual(mockSaveSurveyResultModel());
    });
  });
});
