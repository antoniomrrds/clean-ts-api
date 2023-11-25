import { SurveyModel } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases/survey';

export const mockSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
    },
    {
      answer: 'other_answer',
      image: 'other_image',
    },
  ],
  date: new Date(),
});
export const mockSurveyModel = (): SurveyModel =>
  Object.assign({}, mockSurveyParams(), {
    id: 'any_id',
  });

export const mockSurveysModels = (): SurveyModel[] => {
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
