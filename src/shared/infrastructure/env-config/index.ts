import { getOrDefaultEnvironmentVariable } from '@/shared/infrastructure/env-config/utils';

export const { portServer, mongoUrl, jwtSecret } = {
  portServer: getOrDefaultEnvironmentVariable('PORT', '5000'),
  mongoUrl: getOrDefaultEnvironmentVariable(
    'MONGO_URL',
    'mongodb://localhost:27017/clean-node-api',
  ),
  jwtSecret: getOrDefaultEnvironmentVariable('JWT_SECRET', 't*45-1arf@123'),
};
