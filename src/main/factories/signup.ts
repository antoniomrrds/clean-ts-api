import { Controller } from '@/presentation/ports';
import { EmailValidatorAdapter } from '@/utils';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account-repository';
import { BcryptAdapter } from '@/infrastructure/criptography';
import { DbAddAccount } from '@/application/useCases/add-account';
import { SignUpController } from '@/presentation/controllers/signup';
import { LogControllerDecorator } from '@/decorators/';

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );
  return new LogControllerDecorator(signUpController);
};
