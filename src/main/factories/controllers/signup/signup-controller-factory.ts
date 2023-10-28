import { Controller } from '@/presentation/ports';
import { SignUpController } from '@/presentation/controllers/system-of-login/signup';
import { makeSignUpValidation } from '@/main/factories/controllers/signup';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication';
import { makeDbAddAccount } from '@/main/factories/usecases/add-account';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log';

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(signUpController);
};
