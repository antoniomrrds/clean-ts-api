import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/application/ports';
import { AccountModel } from '@/domain/entities';
import { mockAccountModel } from '@/tests/domain/mocks';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = mockAccountModel();
  Params?: AddAccountRepository.Params;

  async add(
    accountData: AddAccountRepository.Params,
  ): Promise<AddAccountRepository.Result> {
    this.Params = accountData;
    return this.result;
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  email?: string;
  accountModel = mockAccountModel();

  async loadByEmail(email: string): Promise<AccountModel | null> {
    {
      this.email = email;
      return this.accountModel;
    }
  }
}
export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  accountModel = mockAccountModel();
  token?: string;
  role?: string;

  async loadByToken(
    token: string,
    role?: string,
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return this.accountModel;
  }
}
export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository
{
  id?: string;
  token?: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
  }
}
