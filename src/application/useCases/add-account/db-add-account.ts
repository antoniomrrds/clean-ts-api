import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from '@/application/useCases/add-account/ports';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve => resolve(null));
  }
}
