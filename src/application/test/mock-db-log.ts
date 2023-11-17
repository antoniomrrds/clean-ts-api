/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogErrorRepository } from '@/application/ports/db/log';
export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LogErrorRepositoryStub();
};
