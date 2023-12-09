import { DbLoadAnswersBySurvey } from '@/application/usecases';
import { throwError } from '@/tests/domain/mocks';
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/application/mocks';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy =
    new LoadAnswersBySurveyRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);
  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
  };
};
const surveyId = faker.string.uuid();

describe('DbLoadAnswersBySurvey', () => {
  it('Should call loadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId);
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId);
  });
  it('Should return answers survey on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1],
    ]);
  });
  it('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    loadAnswersBySurveyRepositorySpy.result = [];
    const answers = await sut.loadAnswers(surveyId);
    expect(answers).toEqual([]);
  });
  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    jest
      .spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockImplementationOnce(throwError);
    const promise = sut.loadAnswers(surveyId);
    await expect(promise).rejects.toThrow();
  });
});
