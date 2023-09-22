import { AddAccountModel } from '@/domain/usecases';
import { AccountModel } from '@/domain/entities';

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>;
}
