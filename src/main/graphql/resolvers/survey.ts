/* eslint-disable @typescript-eslint/no-explicit-any */
import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveysController } from '@/main/factories';

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) =>
      await adaptResolver(makeLoadSurveysController(), args, context),
  },
};
