/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '@/presentation/ports';

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>;
}
