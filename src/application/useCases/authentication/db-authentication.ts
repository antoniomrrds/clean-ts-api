/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  Authentication,
} from '@/application/useCases/authentication/ports';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password,
      );
      if (isValid) {
        const acesstoken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          acesstoken,
        );
        return acesstoken;
      }
    }
    return null as any;
  }
}
