import { AuthenticationModel } from '@/domain/entities';

export type AuthenticationParams = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(authentication: AuthenticationParams): Promise<AuthenticationModel>;
}
