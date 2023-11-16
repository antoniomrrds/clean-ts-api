import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { auth } from '@/main/middlewares';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result';
export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController()),
  );
};