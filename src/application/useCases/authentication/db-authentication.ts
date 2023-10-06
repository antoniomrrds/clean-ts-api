/* eslint-disable @typescript-eslint/no-explicit-any */
import { HashComparer } from '@/application/ports/criptography';
import { LoadAccountByEmailRepository } from '@/application/ports/db';
import { Authentication, AuthenticationModel } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
    }
    return null as any;
  }
}
