/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  AuthenticationParams,
  Authentication,
  AuthenticationModel,
} from '@/application/useCases/account/authentication/ports';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(
    authentication: AuthenticationParams,
  ): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );

    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password,
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken,
        );
        return { accessToken, name: account.name };
      }
    }
    return null as any;
  }
}
