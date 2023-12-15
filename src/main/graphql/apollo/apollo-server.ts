import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';
import { ApolloServer } from '@apollo/server';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

export const setupApolloServer = (httpServer: http.Server): ApolloServer =>
  new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
