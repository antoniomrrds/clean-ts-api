import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_account_id',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
      count: 1,
      percent: 50,
    },
    {
      answer: 'other_answer',
      image: 'other_image',
      count: 0,
      percent: 0,
    },
  ],
  date: new Date(),
});
export const mockSurveyResultEmpty = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      count: 0,
      percent: 0,
    },
    {
      answer: 'other_answer',
      image: 'other_image',
      count: 0,
      percent: 0,
    },
  ],
  date: new Date(),
});
