import { AddAccountParams } from '@/domain/usecases/account';
import { AccountModel } from '@/domain/entities';

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>;
}
