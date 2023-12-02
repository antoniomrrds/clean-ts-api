import {
  makeDbAuthentication,
  makeLogControllerDecorator,
  makeLoginValidation,
} from '@/main/factories';
import { LoginController } from '@/presentation/controllers';
import { Controller } from '@/presentation/ports';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );
  return makeLogControllerDecorator(loginController);
};
