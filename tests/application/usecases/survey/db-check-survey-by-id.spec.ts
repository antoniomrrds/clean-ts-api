import { DbCheckSurveyById } from '@/application/usecases';
import { throwError } from '@/tests/domain/mocks';
import { CheckSurveyByIdRepositorySpy } from '@/tests/application/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbCheckSurveyById;
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy();
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy);
  return {
    sut,
    checkSurveyByIdRepositorySpy: checkSurveyByIdRepositorySpy,
  };
};
let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid();
  });
  it('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    await sut.checkById(surveyId);
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId);
  });
  it('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut();
    const exists = await sut.checkById(surveyId);
    expect(exists).toBe(true);
  });
  it('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    checkSurveyByIdRepositorySpy.result = false;
    const exists = await sut.checkById(surveyId);
    expect(exists).toBe(false);
  });
  it('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(checkSurveyByIdRepositorySpy, 'checkById')
      .mockImplementationOnce(throwError);
    const promise = sut.checkById(surveyId);
    await expect(promise).rejects.toThrow();
  });
});
