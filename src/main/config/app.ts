import { Express } from 'express';
import http from 'http';
import { setupExpress } from '@/main/config';
import { setupApollo } from '@/main/graphql/config';

export const setupApp = async (): Promise<{
  httpServer: http.Server;
  app: Express;
}> => {
  const app = await setupExpress();
  const httpServer = http.createServer(app);
  await setupApollo(app, httpServer);
  return { httpServer, app };
};
