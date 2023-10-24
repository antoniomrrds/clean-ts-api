import { Controller } from '@/presentation/ports';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { BcryptAdapter } from '@/infrastructure/criptography/bcrypt-adapter';
import { DbAddAccount } from '@/application/useCases/add-account';
import { SignUpController } from '@/presentation/controllers/signup';
import { LogControllerDecorator } from '@/main/decorators';
import { LogMongoRepository } from '@/infrastructure/db/mongodb/log';
import { makeSignUpValidation } from '@/main/factories/signup';
import { jwtSecret } from '@/shared/infrastructure/env-config';
import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import { DbAuthentication } from '@/application/useCases/authentication';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
    dbAuthentication,
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
