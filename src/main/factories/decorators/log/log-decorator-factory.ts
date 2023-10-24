import { LogMongoRepository } from '@/infrastructure/db/mongodb/log';
import { LogControllerDecorator } from '@/main/decorators/log';
import { Controller } from '@/presentation/ports';

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
