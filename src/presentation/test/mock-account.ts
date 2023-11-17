/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountModel } from '@/domain/entities';
import { mockAccountModel } from '@/domain/test';
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
    async auth(authentication: AuthenticationParams): Promise<string> {
      return Promise.resolve('any_token');
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
