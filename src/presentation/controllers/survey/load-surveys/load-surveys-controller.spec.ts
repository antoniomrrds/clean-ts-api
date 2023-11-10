import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys';
import {
  SurveyModel,
  LoadSurveys,
} from '@/presentation/controllers/survey/load-surveys/ports';
import MockDate from 'mockdate';

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterEach(() => {
    MockDate.reset();
  });
  it('Should call LoadSurveys', () => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return Promise.resolve(makeFakeSurveys());
      }
    }
    const loadSurveysStub = new LoadSurveysStub();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    const sut = new LoadSurveysController(loadSurveysStub);
    sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
});
