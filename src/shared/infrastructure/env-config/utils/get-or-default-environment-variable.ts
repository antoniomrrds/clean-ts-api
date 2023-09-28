import * as dotenv from 'dotenv';
dotenv.config();
import { EnvironmentVariableError } from '@/shared/infrastructure/env-config/errors';

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string,
): string => {
  const value = process.env[environmentVariable];

  return (
    value ??
    defaultValue ??
    (() => {
      throw new EnvironmentVariableError(String(environmentVariable));
    })()
  );
};
