import express, { Express } from 'express';
import {
  setupSwagger,
  setupStaticFiles,
  setupMiddlewares,
  setupRoutes,
} from '@/main/config';

export const setupExpress = async (): Promise<Express> => {
  const app = express();
  setupStaticFiles(app);
  setupMiddlewares(app);
  setupSwagger(app);
  setupRoutes(app);
  return app;
};
