/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyResultModel } from '@/domain/entities';
import { mockSaveSurveyResultModel } from '@/domain/test';
import {
  LoadSurveyResult,
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
export const mockLoadSurveyResultStub = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSaveSurveyResultModel());
    }
  }
  return new LoadSurveyResultStub();
};
