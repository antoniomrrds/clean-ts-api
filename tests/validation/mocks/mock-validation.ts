/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validation } from '@/presentation/ports';

export class ValidationSpy implements Validation {
  error: Error | null = null;
  input: any;

  validate(input: any): Error | undefined | null {
    this.input = input;
    return this?.error;
  }
}
