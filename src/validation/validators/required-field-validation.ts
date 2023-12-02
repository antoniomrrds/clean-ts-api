/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/ports';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error | undefined | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
