/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbLoadSurveyResult } from '@/application/useCases/survey-result/load-survey-result';
import {
  SurveyResultModel,
  LoadSurveyResultRepository,
} from '@/application/useCases/survey-result/load-survey-result/ports';
import { mockSaveSurveyResultModel } from '@/domain/test';
describe('DbLoadSurveyResult Usecase', () => {
  it('Should call LoadSurveyResultRepository with correct values', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSaveSurveyResultModel());
      }
    }
    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
