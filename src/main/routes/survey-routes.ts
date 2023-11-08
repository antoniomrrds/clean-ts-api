import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey';
import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter';
import { makeAuthMiddleware } from '@/main/factories/middlewares';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
};
