/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountModel, AuthenticationModel } from '@/domain/entities';
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test';
import {
  AddAccount,
  AddAccountParams,
  LoadAccountByToken,
} from '@/domain/usecases/account';

import {
  Authentication,
  AuthenticationParams,
} from '@/domain/usecases/account';

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(
      authentication: AuthenticationParams,
    ): Promise<AuthenticationModel> {
      return Promise.resolve(mockAuthenticationModel());
    }
  }
  return new AuthenticationStub();
};

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByTokenStub();
};
