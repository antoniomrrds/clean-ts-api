import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSaveSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveSurveyResultParams(), {
    id: 'any_id',
  });
