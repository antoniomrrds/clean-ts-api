import { bodyParser } from '../middlewares';
import { Express } from 'express';

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
};
