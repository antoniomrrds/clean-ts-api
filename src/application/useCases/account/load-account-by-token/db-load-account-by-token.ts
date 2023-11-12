import {
  LoadAccountByToken,
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
} from '@/application/useCases/account/load-account-by-token/ports';

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
