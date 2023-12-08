import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/application/ports';
import { faker } from '@faker-js/faker';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true;
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
  result = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  };

  async loadByEmail(
    email: string,
  ): Promise<LoadAccountByEmailRepository.Result> {
    {
      this.email = email;
      return this.result;
    }
  }
}
export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  result = { id: faker.string.uuid() };
  token?: string;
  role?: string;

  async loadByToken(
    token: string,
    role?: string,
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return this.result;
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
