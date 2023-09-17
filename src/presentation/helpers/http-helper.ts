import { HttpResponse } from '@/presentation/ports';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});
