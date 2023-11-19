import { loginPath } from '@/main/docs/paths';
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
} from '@/main/docs/schemas';
import {
  badRequest,
  unauthorized,
  serverError,
  notFound,
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
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
  },
  components: {
    badRequest,
    notFound,
    unauthorized,
    serverError,
  },
};
