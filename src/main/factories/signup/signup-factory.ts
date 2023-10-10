import { Controller } from '@/presentation/ports';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { BcryptAdapter } from '@/infrastructure/criptography/bcrypt-adapter';
import { DbAddAccount } from '@/application/useCases/add-account';
import { SignUpController } from '@/presentation/controllers/signup';
import { LogControllerDecorator } from '@/main/decorators';
import { LogMongoRepository } from '@/infrastructure/db/mongodb/log';
import { makeSignUpValidation } from '@/main/factories/signup';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};