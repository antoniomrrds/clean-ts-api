import { DbAddAccount } from '@/application/useCases/add-account';
import { BcryptAdapter } from '@/infrastructure/criptography';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account-repository';
import { SignUpController } from '@/presentation/controllers/signup';
import { EmailValidatorAdapter } from '@/utils';

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
