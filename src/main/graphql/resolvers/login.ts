/* eslint-disable @typescript-eslint/no-explicit-any */
import { adaptResolver } from '@/main/adapters';
import { makeLoginController, makeSignUpController } from '@/main/factories';

export default {
  Query: {
    login: async (parent: any, args: any) =>
      await adaptResolver(makeLoginController(), args),
  },
  Mutation: {
    signup: async (parent: any, args: any) =>
      await adaptResolver(makeSignUpController(), args),
  },
};
