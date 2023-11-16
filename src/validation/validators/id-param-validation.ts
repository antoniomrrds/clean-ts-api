import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/ports';
import { IdValidator } from '@/validation/ports';

export class IdParamValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly idValidator: IdValidator,
  ) {}

  validate(id: string): Error | undefined {
    if (!this.isValidId(id)) {
      return new InvalidParamError(this.fieldName);
    }
  }

  private isValidId(id: string): boolean {
    return this.idValidator.isValidId(id);
  }
}
