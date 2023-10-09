import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { makeSignUpController } from '@/main/factories/signup';
import { makeLoginController } from '@/main/factories/login';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
