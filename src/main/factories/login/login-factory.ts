import { LogControllerDecorator } from '@/main/decorators';
import { makeLoginValidation } from '@/main/factories/login/login-validation-factory';
import { Controller } from '@/presentation/ports';
import { DbAuthentication } from '@/application/useCases/authentication';
import { LoginController } from '@/presentation/controllers/login';
import { LogMongoRepository } from '@/infrastructure/db/mongodb/log';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { BcryptAdapter } from '@/infrastructure/criptography/bcrypt-adapter';
import { JwtAdapter } from '@/infrastructure/criptography/jwt-adapter';
import { jwtSecret } from '@/shared/infrastructure/env-config';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
