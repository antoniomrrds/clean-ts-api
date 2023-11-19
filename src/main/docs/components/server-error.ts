export const serverError = {
  description: 'Probelema no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
