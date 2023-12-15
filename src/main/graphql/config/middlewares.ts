import { expressGraphql } from '@/main/graphql/middlewares';
import { ApolloServer } from '@apollo/server';
import { Express } from 'express';

export const setupApolloMiddlewares = (
  app: Express,
  server: ApolloServer,
): void => {
  app.use(expressGraphql(server));
};
