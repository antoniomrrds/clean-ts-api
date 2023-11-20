import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
} from '@/main/docs/components';
import { apikeyAuthSchema } from '@/main/docs/schemas';
export const components = {
  securitySchemes: {
    apiKeyAuth: apikeyAuthSchema,
  },
  badRequest,
  notFound,
  unauthorized,
  serverError,
  forbidden,
};
