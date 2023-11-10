import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey';
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-surveys';
import { adminAuth, auth } from '@/main/middlewares';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()));
};
