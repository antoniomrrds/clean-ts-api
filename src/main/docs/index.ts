import { loginPath } from '@/main/docs/paths';
import { accountSchema, loginParamsSchema } from '@/main/docs/schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0',
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
      description: 'APIs relacionadas a Login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
