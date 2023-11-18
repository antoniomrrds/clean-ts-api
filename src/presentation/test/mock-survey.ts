/* eslint-disable @typescript-eslint/no-unused-vars */

import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/domain/test';
import {
  AddSurvey,
  AddSurveyParams,
  LoadSurveyById,
  LoadSurveys,
} from '@/domain/usecases/survey';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }

  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysModels());
    }
  }
  return new LoadSurveysStub();
};

export const mockLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdStub();
};
