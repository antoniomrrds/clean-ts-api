import { getOrDefaultEnvironmentVariable } from '@/shared/infrastructure/env-config/utils';

export const { portServer, mongoUrl } = {
  portServer: getOrDefaultEnvironmentVariable('PORT', '5000'),
  mongoUrl: getOrDefaultEnvironmentVariable(
    'MONGO_URL',
    'mongodb://127.0.0.1:27017/clean-node-api',
  ),
};