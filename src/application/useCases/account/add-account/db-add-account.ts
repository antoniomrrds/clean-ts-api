/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/application/useCases/account/add-account/ports';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      const account = await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword }),
      );
      return account;
    }
    return null as any;
  }
}
