import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
