import { makeAuthMiddleware } from '@/main/factories';
import { handleGraphQLError } from '@/main/graphql/errors';
import { getEnumKeyByValue } from '@/main/graphql/helpers';

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';

export const authDirectiveTransformer = (
  schema: GraphQLSchema,
): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const authDirective = getDirective(schema, fieldConfig, 'auth');
      if (authDirective) {
        const { resolve } = fieldConfig;
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            accessToken: context?.req?.headers?.['x-access-token'],
          };
          const httpResponse = await makeAuthMiddleware().handle(request);
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body);
            return resolve?.call(this, parent, args, context, info);
          } else {
            return handleGraphQLError(
              httpResponse.body.message,
              403,
              getEnumKeyByValue(403),
            );
          }
        };
      }
      return fieldConfig;
    },
  });
};
