import { AccountModel } from '@/domain/entities';

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>;
}
