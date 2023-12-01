import { AccountModel, AuthenticationModel } from '@/domain/entities';
import {
  AddAccountParams,
  AuthenticationParams,
} from '@/domain/usecases/account';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});
export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: 'any_id',
  });

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAuthenticationModel = (): AuthenticationModel => ({
  name: 'any_name',
  accessToken: 'any_token',
});
