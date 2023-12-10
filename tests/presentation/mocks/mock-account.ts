import {
  AddAccount,
  Authentication,
  LoadAccountByToken,
} from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export class AddAccountSpy implements AddAccount {
  Params?: AddAccount.Params;
  result = true;
  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.Params = account;
    return this.result;
  }
}

export class AuthenticationSpy implements Authentication {
  Params?: Authentication.Params;
  result = {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName(),
  };

  async auth(
    authenticationParams: Authentication.Params,
  ): Promise<Authentication.Result> {
    this.Params = authenticationParams;
    return this.result;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result = {
    id: faker.string.uuid(),
  };

  accessToken?: string;
  role?: string;

  async load(
    accessToken: string,
    role?: string,
  ): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken;
    this.role = role;
    return this.result;
  }
}
