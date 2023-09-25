import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  readdirSync(`${__dirname}/../routes`).map(async filename => {
    if (!filename.includes('.test.')) {
      (await import(`../routes/${filename}`)).default(router);
    }
  });
};
