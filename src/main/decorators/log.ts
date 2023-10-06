/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogErrorRepository } from '@/application/ports/db';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/ports';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse?.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
