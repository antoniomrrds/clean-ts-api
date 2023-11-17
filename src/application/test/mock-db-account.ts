/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/application/ports/db/account';
import { AccountModel } from '@/domain/entities';
import { mockAccountModel } from '@/domain/test';
import { AddAccountParams } from '@/domain/usecases/account';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(token: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(mockAccountModel());
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };
export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      updateAccessToken(id: string, token: string): Promise<void> {
        return Promise.resolve();
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };
export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        return Promise.resolve(mockAccountModel());
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };
