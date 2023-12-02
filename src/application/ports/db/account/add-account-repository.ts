import { AddAccountParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/entities';

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>;
}
