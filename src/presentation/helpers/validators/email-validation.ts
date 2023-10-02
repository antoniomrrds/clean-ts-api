/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/helpers/validators';
import { EmailValidator } from '@/presentation/ports/email-validator';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}
  validate(input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
