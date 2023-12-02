import { LoadAccountByToken } from '@/domain/usecases';
import { jwtSecret } from '@/main/config/env';
import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import { AccountMongoRepository } from '@/infrastructure/db';
import { DbLoadAccountByToken } from '@/application/usecases';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
