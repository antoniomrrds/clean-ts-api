import { AddAccountModel } from '@/domain/usecases/account';
import { AccountModel } from '@/domain/entities';

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>;
}
