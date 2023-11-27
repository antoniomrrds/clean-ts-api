/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports/db/survey-result';
import { SurveyResultModel } from '@/domain/entities';
import { mockSurveyResultModel } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(surveyData: SaveSurveyResultParams): Promise<void> {
        return Promise.resolve();
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };
export const mockLoadSurveyResultRepository =
  (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(
        surveyId: string,
      ): Promise<SurveyResultModel | null> {
        return Promise.resolve(mockSurveyResultModel());
      }
    }
    return new LoadSurveyResultRepositoryStub();
  };
