import { Authentication } from '@/domain/usecases';
import { jwtSecret } from '@/main/config/env';
import { JwtAdapter, BcryptAdapter } from '@/infrastructure/criptography';
import { DbAuthentication } from '@/application/usecases';
import { AccountMongoRepository } from '@/infrastructure/db';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
