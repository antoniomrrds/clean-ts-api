/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/ports';
import { EmailValidator } from '@/validation/ports';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}
  validate(input: any): Error | undefined | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
