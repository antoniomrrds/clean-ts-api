import { LogMongoRepository } from '@/infrastructure/db';
import { LogControllerDecorator } from '@/main/decorators';
import { Controller } from '@/presentation/ports';

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
};
