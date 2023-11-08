import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token';
import { AuthMiddleware } from '@/presentation/middlewares';
import { Middleware } from '@/presentation/ports';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
