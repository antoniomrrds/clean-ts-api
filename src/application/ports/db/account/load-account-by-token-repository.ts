import { AccountModel } from '@/domain/entities';

export interface LoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<AccountModel | null>;
}
