import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
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

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id;
    return this.result;
  }
}
export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true;
  id?: string;

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id;
    return this.result;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId?: string;
  result = mockSurveysModels();

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return this.result;
  }
}
