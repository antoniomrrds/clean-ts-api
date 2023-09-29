import * as dotenv from 'dotenv';
dotenv.config();
import { EnvironmentVariableError } from '@/shared/infrastructure/env-config/errors';

export const getOrDefaultEnvironmentVariable = (
  environmentVariable: string,
  defaultValue?: string,
): string => {
  const value = process.env[environmentVariable];
  if (!value && defaultValue) return defaultValue;
  if (!value && !defaultValue) {
    throw new EnvironmentVariableError(String(environmentVariable));
  }
  return value as string;
};
