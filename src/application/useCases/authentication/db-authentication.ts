/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  Authentication,
} from '@/application/useCases/authentication/ports';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );

    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password,
      );
      if (isValid) {
        const accesstoken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accesstoken,
        );
        return accesstoken;
      }
    }
    return null as any;
  }
}
