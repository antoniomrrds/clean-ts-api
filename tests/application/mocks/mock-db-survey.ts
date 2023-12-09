import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
} from '@/application/ports';
import { SurveyModel } from '@/domain/entities';
import { mockSurveyModel, mockSurveysModels } from '@/tests/domain/mocks';
import { faker } from '@faker-js/faker';

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

export class LoadAnswersBySurveyRepositorySpy
  implements LoadAnswersBySurveyRepository
{
  result = [faker.lorem.word(), faker.lorem.word()];
  id?: string;

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
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
