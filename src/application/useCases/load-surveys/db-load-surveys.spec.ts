import { LoadSurveysRepository } from '@/application/ports/db/survey';
import { DbLoadSurveys } from '@/application/useCases/load-surveys';
import { SurveyModel } from '@/domain/entities';

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image',
        },
      ],
      date: new Date(),
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer',
          image: 'other_image',
        },
      ],
      date: new Date(),
    },
  ];
};

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        return Promise.resolve(makeFakeSurveys());
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });
});
