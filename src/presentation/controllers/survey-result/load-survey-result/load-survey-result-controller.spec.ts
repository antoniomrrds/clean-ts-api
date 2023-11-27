/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result';
import {
  HttpRequest,
  LoadSurveyById,
  LoadSurveyResult,
  Validation,
} from '@/presentation/controllers/survey-result/load-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  serverError,
} from '@/presentation/helpers/http';
import {
  mockLoadSurveyByIdStub,
  mockLoadSurveyResultStub,
} from '@/presentation/test';
import { mockValidation } from '@/validation/test';
import { throwError } from '@/domain/test';

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  validationStub: Validation;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResultStub();
  const loadSurveyByIdStub = mockLoadSurveyByIdStub();
  const validationStub = mockValidation();

  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    validationStub,
    loadSurveyResultStub,
  );
  return {
    sut,
    loadSurveyByIdStub,
    validationStub,
    loadSurveyResultStub,
  };
};
describe('LoadSurveyResult Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new InvalidParamError('any_field'));

    const httpRequest = mockFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('any_field')),
    );
  });

  it('should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const httpRequest = mockFakeRequest();
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });
  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null as any));
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');
    const httpRequest = mockFakeRequest();

    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });
  it('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
