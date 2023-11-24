/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockLoadSurveyResultRepository } from '@/application/test';
import { DbLoadSurveyResult } from '@/application/useCases/survey-result/load-survey-result';
import { LoadSurveyResultRepository } from '@/application/useCases/survey-result/load-survey-result/ports';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub,
  };
};
describe('DbLoadSurveyResult Usecase', () => {
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
