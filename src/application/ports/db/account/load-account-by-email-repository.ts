import { AccountModel } from '@/domain/entities';

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel | null>;
}
