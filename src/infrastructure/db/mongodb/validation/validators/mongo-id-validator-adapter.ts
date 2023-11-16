import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { IdValidator } from '@/validation/ports';
export class MongoIdValidatorAdapter implements IdValidator {
  isValidId(id: string): boolean {
    try {
      return MongoHelper.isValidObjectId(id);
    } catch (error) {
      return false;
    }
  }
}
