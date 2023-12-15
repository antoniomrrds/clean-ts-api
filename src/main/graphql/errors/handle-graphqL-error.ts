import { GraphQLError } from 'graphql';
export const handleGraphQLError = (
  message: string,
  code: number,
  status: string,
) => {
  throw new GraphQLError(message, {
    extensions: {
      code: code,
      message: message,
      status: status,
    },
  });
};
