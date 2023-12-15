import { setupApolloServer } from '@/main/graphql/apollo';
import { setupApolloMiddlewares } from '@/main/graphql/config';
import { ApolloServer } from '@apollo/server';
import { Express } from 'express';
import http from 'http';
export const setupApollo = async (
  app: Express,
  httpServer: http.Server,
): Promise<ApolloServer> => {
  const server = setupApolloServer(httpServer);
  await server.start();
  setupApolloMiddlewares(app, server);
  return server;
};
