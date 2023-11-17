/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/ports/db/survey';
import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/domain/test';
import { AddSurveyParams } from '@/domain/usecases/survey';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};
export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysModels());
    }
  }
  return new LoadSurveysRepositoryStub();
};
