import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result';
import {
  HttpRequest,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { mockLoadSurveyByIdStub } from '@/presentation/test';

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub,
  };
};
describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct id', () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    sut.handle(mockFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });
});
