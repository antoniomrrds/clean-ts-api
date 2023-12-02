import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/application/ports';
import { AccountModel } from '@/domain/entities';
import { AddAccount, AddAccountParams } from '@/domain/usecases';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return null as any;
  }
}
