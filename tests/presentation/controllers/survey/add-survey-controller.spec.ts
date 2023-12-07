import { AddSurveyController } from '@/presentation/controllers';
import { badRequest, noContent, serverError } from '@/presentation/helpers';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { throwError } from '@/tests/domain/mocks';
import { AddSurveySpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.lorem.words(),
  answers: [
    {
      image: faker.internet.avatar(),
      answer: faker.lorem.word(),
    },
  ],
});

type SutTypes = {
  sut: AddSurveyController;
  validationSpy: ValidationSpy;
  addSurveySpy: AddSurveySpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationSpy, addSurveySpy);
  return {
    sut,
    validationSpy,
    addSurveySpy,
  };
};
const request = mockRequest();

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut();
    await sut.handle(request);
    expect(addSurveySpy.Params).toEqual({
      ...request,
      date: new Date(),
    });
  });

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut();
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
  });
});
