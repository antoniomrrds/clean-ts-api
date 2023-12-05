import { HttpResponse } from '@/presentation/ports';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Middleware<M = any> {
  handle: (request: M) => Promise<HttpResponse>;
}
