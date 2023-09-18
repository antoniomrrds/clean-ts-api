import { Encrypter } from '@/application/ports';
import { AccountModel } from '@/domain/entities';
import { AddAccount, AddAccountModel } from '@/domain/usecases';
export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve => resolve(null));
  }
}
