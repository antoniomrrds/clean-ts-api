import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/ports';
import { ObjectIdValidator } from '@/validation/ports';

export class IdParamValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly objectIdValidator: ObjectIdValidator,
  ) {}
  validate(id: string): Error | undefined {
    const isValid = this.objectIdValidator.isValidObjectId(id);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
