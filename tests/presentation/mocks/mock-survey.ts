import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/tests/domain/mocks';
import {
  AddSurvey,
  LoadSurveyById,
  LoadSurveys,
} from '@/domain/usecases/survey';
export class AddSurveySpy implements AddSurvey {
  Params?: AddSurvey.Params;

  async add(data: AddSurvey.Params): Promise<void> {
    this.Params = data;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveysModels();
  accountId?: string;

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return this.surveyModels;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  id?: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return this.surveyModel;
  }
}
