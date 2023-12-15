/* eslint-disable @typescript-eslint/no-explicit-any */
import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveysController } from '@/main/factories';

export default {
  Query: {
    surveys: async () => await adaptResolver(makeLoadSurveysController()),
  },
};
