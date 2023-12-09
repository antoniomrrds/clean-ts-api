import {
  LoadAnswersBySurveySpy,
  SaveSurveyResultSpy,
} from '@/tests/presentation/mocks';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { throwError } from '@/tests/domain/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';

const mockRequest = (
  answer: string = null!,
): SaveSurveyResultController.Request => ({
  surveyId: faker.string.uuid(),
  answer,
  accountId: faker.string.uuid(),
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy();
  const sut = new SaveSurveyResultController(
    validationSpy,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy,
  );
  return {
    sut,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy,
    validationSpy,
  };
};
const request = mockRequest();
describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request.surveyId);
  });
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new InvalidParamError('any_field');
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
  it('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(loadAnswersBySurveySpy.id).toBe(request.surveyId);
  });
  it('should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();
    loadAnswersBySurveySpy.result = [];
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  it('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut();
    jest
      .spyOn(loadAnswersBySurveySpy, 'loadAnswers')
      .mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut();
    const request = mockRequest(loadAnswersBySurveySpy.result[0]);
    await sut.handle(request);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer,
    });
  });
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);
    const request = mockRequest(loadAnswersBySurveySpy.result[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 on success', async () => {
    const { sut, loadAnswersBySurveySpy, saveSurveyResultSpy } = makeSut();
    const request = mockRequest(loadAnswersBySurveySpy.result[0]);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
