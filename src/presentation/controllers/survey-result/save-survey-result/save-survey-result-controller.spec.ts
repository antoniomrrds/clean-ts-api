/* eslint-disable @typescript-eslint/no-explicit-any */

import { mockSaveSurveyResultModel, throwError } from '@/domain/test';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result';
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  Validation,
} from '@/presentation/controllers/survey-result/save-survey-result/ports';
import { InvalidParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http';
import {
  mockLoadSurveyByIdStub,
  mockSaveSurveyResultStub,
} from '@/presentation/test';
import { mockValidation } from '@/validation/test';
import MockDate from 'mockdate';

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const saveSurveyResultStub = mockSaveSurveyResultStub();
  const loadSurveyByIdStub = mockLoadSurveyByIdStub();
  const sut = new SaveSurveyResultController(
    validationStub,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
    validationStub,
  };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
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
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const httpRequest = mockFakeRequest();
    await sut.handle(httpRequest);

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
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
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    });
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
    const httpRequest = mockFakeRequest();
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      date: new Date(),
      answer: httpRequest.body.answer,
    });
  });
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(ok(mockSaveSurveyResultModel()));
  });
});
