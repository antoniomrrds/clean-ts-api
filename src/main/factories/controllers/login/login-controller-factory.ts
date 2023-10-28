import { makeLoginValidation } from '@/main/factories/controllers/login';
import { Controller } from '@/presentation/ports';
import { LoginController } from '@/presentation/controllers/system-of-login/login';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log';

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );
  return makeLogControllerDecorator(loginController);
};
