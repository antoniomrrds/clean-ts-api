/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerError } from '@/presentation/errors';
import { HttpResponse } from '@/presentation/ports';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});

export const created = <T = any>(data: T): HttpResponse => ({
  statusCode: 201,
  body: data,
});
