/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@/presentation/ports';

export const adaptResolver = async (
  controller: Controller,
  args?: any,
): Promise<any> => {
  const request = { ...(args || {}) };
  const httpResponse = await controller.handle(request);
  return httpResponse.body;
};
