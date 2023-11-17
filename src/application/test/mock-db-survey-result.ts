/* eslint-disable @typescript-eslint/no-unused-vars */
import { SaveSurveyResultRepository } from '@/application/ports/db/survey-result';
import { SurveyResultModel } from '@/domain/entities';
import { mockSaveSurveyResultModel } from '@/domain/test';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(
        surveyData: SaveSurveyResultParams,
      ): Promise<SurveyResultModel> {
        return Promise.resolve(mockSaveSurveyResultModel());
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };
