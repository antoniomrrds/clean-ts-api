import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/ports';
import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/tests/domain/mocks';
import { AddSurveyParams } from '@/domain/usecases/survey';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams?: AddSurveyParams;

  async add(surveyData: AddSurveyParams): Promise<void> {
    this.addSurveyParams = surveyData;
    return Promise.resolve();
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
