/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@/presentation/ports';
import { handleGraphQLError } from '@/main/graphql/errors';
import { getEnumKeyByValue } from '@/main/graphql/helpers';
export const adaptResolver = async (
  controller: Controller,
  args?: any,
  context?: any,
): Promise<any> => {
  const request = { ...(args || {}), accountId: context?.req?.accountId };
  const httpResponse = await controller.handle(request);
  const { statusCode } = httpResponse;
  switch (statusCode) {
    case 200:
    case 201:
    case 204:
      return httpResponse.body;
    case 400:
      return handleGraphQLError(
        httpResponse.body.message,
        statusCode,
        getEnumKeyByValue(statusCode),
      );
    case 401:
      return handleGraphQLError(
        httpResponse.body.message,
        statusCode,
        getEnumKeyByValue(statusCode),
      );
    case 403:
      return handleGraphQLError(
        httpResponse.body.message,
        statusCode,
        getEnumKeyByValue(statusCode),
      );
    default:
      return handleGraphQLError(
        httpResponse.body.message,
        statusCode,
        getEnumKeyByValue(),
      );
  }
};
