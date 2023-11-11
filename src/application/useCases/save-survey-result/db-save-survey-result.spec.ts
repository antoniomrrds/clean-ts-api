/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbSaveSurveyResult } from '@/application/useCases/save-survey-result';
import {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResultModel,
} from '@/application/useCases/save-survey-result/ports';

import MockDate from 'mockdate';

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answers: 'any_answer',
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), {
    id: 'any_id',
  });

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
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

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    await sut.save(makeFakeSurveyResult());
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResult());
  });
});
