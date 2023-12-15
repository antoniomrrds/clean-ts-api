import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

export const expressGraphql = (server: ApolloServer) =>
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  });
