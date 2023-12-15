/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, getEnumKeyByValue } from '@/main/graphql/helpers';
import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';
import { ApolloServer } from '@apollo/server';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLError } from 'graphql';
import http from 'http';

const handleErrors = (
  response: any,
  errors: readonly GraphQLError[] | undefined,
): void => {
  errors?.forEach(error => {
    response.data = undefined;
    if (checkError(error, getEnumKeyByValue(400))) {
      response.http.status = HttpStatus.BAD_REQUEST;
    } else if (checkError(error, getEnumKeyByValue(401))) {
      response.http.status = HttpStatus.UNAUTHORIZED;
    } else if (checkError(error, getEnumKeyByValue(403))) {
      response.http.status = HttpStatus.FORBIDDEN;
    } else {
      response.http.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
  });
};

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error?.name, error.extensions?.status].some(
    name => name === errorName,
  );
};

export const setupApolloServer = (httpServer: http.Server): ApolloServer =>
  new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) =>
            handleErrors(response, errors),
        }),
      },
    ],
  });
