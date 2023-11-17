import { mockAddSurveyRepository } from '@/application/test';
import { DbAddSurvey } from '@/application/useCases/survey/add-survey/db-add-survey';
import { AddSurveyRepository } from '@/application/useCases/survey/add-survey/ports';
import { mockSurveyParams, throwError } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    await sut.add(mockSurveyParams());
    expect(addSpy).toHaveBeenCalledWith(mockSurveyParams());
  });
  it('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError);
    const promise = sut.add(mockSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
