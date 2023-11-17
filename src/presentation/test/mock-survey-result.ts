/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyModel, SurveyResultModel } from '@/domain/entities';
import { mockSaveSurveyResultModel } from '@/domain/test';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usecases/survey-result';

export const mockSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSaveSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
