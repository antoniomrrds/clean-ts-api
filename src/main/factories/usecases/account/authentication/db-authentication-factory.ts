import { Authentication } from '@/domain/usecases';
import { BcryptAdapter } from '@/infrastructure/criptography/bcrypt-adapter';
import { jwtSecret } from '@/shared/infrastructure/env-config';
import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import { DbAuthentication } from '@/application/useCases/authentication';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';

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
