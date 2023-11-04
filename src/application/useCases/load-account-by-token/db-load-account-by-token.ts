/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decrypter } from '@/application/ports/criptography';
import { AccountModel } from '@/domain/entities';
import { LoadAccountByToken } from '@/domain/usecases';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);
    return null as any;
  }
}
