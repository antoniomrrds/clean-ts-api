/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result';
import {
  HttpRequest,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http';
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
  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null as any));
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
});
