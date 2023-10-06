import { LogErrorRepository } from '@/application/ports/db';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
