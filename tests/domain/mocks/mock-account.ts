import { AccountModel, AuthenticationModel } from '@/domain/entities';
import { AddAccount, AuthenticationParams } from '@/domain/usecases/account';

import { faker } from '@faker-js/faker';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: faker.string.uuid(),
  });

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationModel = (): AuthenticationModel => ({
  name: faker.person.fullName(),
  accessToken: faker.string.uuid(),
});
