import { HttpRequest, HttpResponse } from '@/presentation/ports';

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
