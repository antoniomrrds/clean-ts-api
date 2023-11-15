import { Validation } from '@/presentation/ports';
import { ObjectIdValidator } from '@/validation/ports';

export class IdParamValidation implements Validation {
  constructor(private readonly objectIdValidator: ObjectIdValidator) {}

  validate(id: string): Error | undefined {
    this.objectIdValidator.isValidObjectId(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
