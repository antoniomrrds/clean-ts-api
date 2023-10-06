/* eslint-disable @typescript-eslint/no-explicit-any */
import { HashComparer, TokenGenerator } from '@/application/ports/criptography';
import { LoadAccountByEmailRepository } from '@/application/ports/db';
import { Authentication, AuthenticationModel } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
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
        return acesstoken;
      }
    }
    return null as any;
  }
}
