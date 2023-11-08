import { LoadAccountByToken } from '@/domain/usecases';
import { jwtSecret } from '@/shared/infrastructure/env-config';
import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { DbLoadAccountByToken } from '@/application/useCases/load-account-by-token';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
