import { throwError } from '@/tests/domain/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import {
  LoadSurveyByIdSpy,
  SaveSurveyResultSpy,
} from '@/tests/presentation/mocks';
import { SaveSurveyResultController } from '@/presentation/controllers';

import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';

import MockDate from 'mockdate';
import { HttpRequest } from '@/presentation/ports';
import { faker } from '@faker-js/faker';

const mockRequest = (answer: string = null!): HttpRequest => ({
  params: {
    surveyId: faker.string.uuid(),
  },
  body: {
    answer,
  },
  accountId: faker.string.uuid(),
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const sut = new SaveSurveyResultController(
    validationSpy,
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
  );
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
    validationSpy,
  };
};
let httpRequest: HttpRequest;
describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    httpRequest = mockRequest();
  });
  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.params.surveyId);
  });
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new InvalidParamError('any_field');
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    await sut.handle(httpRequest);
    expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null!;
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdSpy, 'loadById')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    await sut.handle(httpRequest);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      date: new Date(),
      answer: httpRequest.body.answer,
    });
  });
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
