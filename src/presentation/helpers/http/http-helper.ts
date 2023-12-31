/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerError, UnauthorizedError } from '@/presentation/errors';
import { HttpResponse } from '@/presentation/ports';

export const ok = <T = any>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = <T = any>(data: T): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const serverError = (error: unknown): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error : undefined),
});
