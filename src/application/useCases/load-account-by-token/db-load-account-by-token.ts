/* eslint-disable @typescript-eslint/no-unused-vars */

import { Decrypter } from '@/application/ports/criptography';
import { LoadAccountByTokenRepository } from '@/application/ports/db/account';
import { AccountModel } from '@/domain/entities';
import { LoadAccountByToken } from '@/domain/usecases';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role,
      );

      if (account) {
        return account;
      }
    }

    return null;
  }
}
