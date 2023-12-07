import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/ports';
import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/tests/domain/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  Params?: AddSurveyRepository.Params;

  async add(surveyData: AddSurveyRepository.Params): Promise<void> {
    this.Params = surveyData;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel();
  id?: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.result);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId?: string;
  result = mockSurveysModels();

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return Promise.resolve(this.result);
  }
}
