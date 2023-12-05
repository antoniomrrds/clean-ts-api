import {
  LoadSurveyByIdSpy,
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
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    const request = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    await sut.handle(request);
    expect(loadSurveyByIdSpy.id).toBe(request.surveyId);
  });
  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null!;
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdSpy, 'loadById')
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
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const request = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    await sut.handle(request);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer,
    });
  });
  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);
    const request = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut();
    const request = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer,
    );
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
