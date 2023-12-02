/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validation } from '@/presentation/ports';

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(input: any): Error | undefined | null {
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) return error;
    }
  }
}
