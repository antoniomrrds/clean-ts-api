import { Express } from 'express';
import swaggerConfig from '@/main/docs';
import { serve, setup } from 'swagger-ui-express';
import { noCahe } from '@/main/middlewares';

export default (app: Express): void => {
  app.use('/api-docs', noCahe, serve, setup(swaggerConfig));
};
