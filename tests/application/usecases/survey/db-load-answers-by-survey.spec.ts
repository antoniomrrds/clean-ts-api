import { DbLoadAnswersBySurvey } from '@/application/usecases';
import { throwError } from '@/tests/domain/mocks';
import { LoadSurveyByIdRepositorySpy } from '@/tests/application/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy);
  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};
const surveyId = faker.string.uuid();

describe('DbLoadAnswersBySurvey', () => {
  it('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId);
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });
  it('Should return answers survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answer,
      loadSurveyByIdRepositorySpy.result.answers[1].answer,
    ]);
  });
  it('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    loadSurveyByIdRepositorySpy.result = null!;
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([]);
  });
  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });
});
