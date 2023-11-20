import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  signUpParamsSchema,
  addSurveyParamsSchema,
  saveSurveyResultParamsSchema,
  surveyResultSchema,
} from '@/main/docs/schemas';

export const schemas = {
  account: accountSchema,
  error: errorSchema,
  loginParams: loginParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  signUpParams: signUpParamsSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  surveyResult: surveyResultSchema,
};
