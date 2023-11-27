import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result';
import { HttpRequest } from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { mockLoadSurveyByIdStub } from '@/presentation/test';

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});
describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct id', () => {
    const loadSurveyByIdStub = mockLoadSurveyByIdStub();
    const sut = new LoadSurveyResultController(loadSurveyByIdStub);
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    sut.handle(mockFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });
});
