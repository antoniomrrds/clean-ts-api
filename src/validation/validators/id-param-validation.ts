import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/ports';
import { IdValidator } from '@/validation/ports';

export class IdParamValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly idValidator: IdValidator,
  ) {}
  validate(id: string): Error | undefined {
    const isValid = this.idValidator.isValidId(id);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
