import { AccountModel } from '@/domain/entities';
import { AddAccount, Authentication } from '@/domain/usecases';

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

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

// export const mockAuthenticationModel = (): Authentication.Result => ({
//   name: faker.person.fullName(),
//   accessToken: faker.string.uuid(),
// });
