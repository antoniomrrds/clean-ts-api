import { HttpRequest, HttpResponse } from '@/presentation/ports';

export interface Controller {
  handle: (httpRequest: HttpRequest) => HttpResponse;
}
