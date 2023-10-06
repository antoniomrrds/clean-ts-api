/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadAccountByEmailRepository } from '@/application/ports/db';
import { Authentication, AuthenticationModel } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null as any;
  }
}
