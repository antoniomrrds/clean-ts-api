import {
  makeDbAddAccount,
  makeDbAuthentication,
  makeLogControllerDecorator,
  makeSignUpValidation,
} from '@/main/factories';
import { SignUpController } from '@/presentation/controllers';
import { Controller } from '@/presentation/ports';

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(signUpController);
};
