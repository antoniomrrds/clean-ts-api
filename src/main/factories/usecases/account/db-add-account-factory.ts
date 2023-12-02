import { AddAccount } from '@/domain/usecases';
import { AccountMongoRepository } from '@/infrastructure/db';
import { BcryptAdapter } from '@/infrastructure/criptography';
import { DbAddAccount } from '@/application/usecases';

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
