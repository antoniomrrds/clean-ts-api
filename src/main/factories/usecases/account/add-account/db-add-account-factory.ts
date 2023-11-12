import { AddAccount } from '@/domain/usecases/account';
import { AccountMongoRepository } from '@/infrastructure/db/mongodb/account';
import { BcryptAdapter } from '@/infrastructure/criptography/bcrypt-adapter';
import { DbAddAccount } from '@/application/useCases/account/add-account';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};
