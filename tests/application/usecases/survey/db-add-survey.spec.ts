import { DbAddSurvey } from '@/application/usecases';
import { AddSurveyParams } from '@/domain/usecases/survey';
import { AddSurveyRepositorySpy } from '@/tests/application/mocks';
import { mockSurveyParams, throwError } from '@/tests/domain/mocks';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);
  return {
    sut,
    addSurveyRepositorySpy,
  };
};

let surveyData: AddSurveyParams;

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(() => {
    surveyData = mockSurveyParams();
  });

  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add');
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
  it('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest
      .spyOn(addSurveyRepositorySpy, 'add')
      .mockImplementationOnce(throwError);
    const promise = sut.add(surveyData);
    await expect(promise).rejects.toThrow();
  });
});
