import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { IdValidator } from '@/validation/ports';
export class MongoIdValidatorAdapter implements IdValidator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValidId(id: string): boolean {
    return MongoHelper.isValidObjectId(id);
  }
}
