import { loginPath, surveyPath } from '@/main/docs/paths';
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  apikeyAuthSchema,
} from '@/main/docs/schemas';
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
} from '@/main/docs/components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0',
  },
  license: {
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
    name: 'GPL-3.0-or-later',
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor principal',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Enquete',
    },
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apikeyAuthSchema,
    },
    badRequest,
    notFound,
    unauthorized,
    serverError,
    forbidden,
  },
};
