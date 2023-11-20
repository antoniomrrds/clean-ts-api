import { components } from '@/main/docs/component';
import { paths } from '@/main/docs/path';
import { schemas } from '@/main/docs/schema';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0',
    contact: {
      email: 'antoniomarcos@gmail.com',
    },
    license: {
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
      name: 'GPL-3.0-or-later',
    },
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
  paths,
  schemas,
  components,
};
