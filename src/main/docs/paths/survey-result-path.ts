export const surveyResultPath = {
  put: {
    tags: ['Enquete'],
    summary: 'API para criar a resposta de uma enquete',
    description:
      'Essa rota só pode ser executada por **usuários autenticados**',
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        description: 'ID da enquete a ser respondida',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
  get: {
    tags: ['Enquete'],
    summary: 'API para consultar o resultado de uma enquete',
    description: 'Essa rota pode ser executada por **usuários autenticados**',
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        description: 'ID da enquete a ser respondida',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      403: {
        $ref: '#/components/forbidden',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
