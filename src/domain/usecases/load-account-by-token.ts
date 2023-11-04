import { AccountModel } from '@/domain/entities';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel>;
}
