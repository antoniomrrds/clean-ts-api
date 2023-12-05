import { LoadSurveyResultController } from '@/presentation/controllers';
import { InvalidParamError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import {
  LoadSurveyResultSpy,
  LoadSurveyByIdSpy,
} from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import { throwError } from '@/tests/domain/mocks';

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  validationSpy: ValidationSpy;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const validationSpy = new ValidationSpy();

  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    validationSpy,
    loadSurveyResultSpy,
  );
  return {
    sut,
    loadSurveyByIdSpy,
    validationSpy,
    loadSurveyResultSpy,
  };
};
const request = mockRequest();

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(request);
    expect(validationSpy.input).toBe(request.surveyId);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new InvalidParamError(faker.lorem.word());
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  it('should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
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
  it('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    await sut.handle(request);
    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId);
  });

  it('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel));
  });
});
