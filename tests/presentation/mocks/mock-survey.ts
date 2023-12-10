import { mockSurveysModels } from '@/tests/domain/mocks';
import {
  AddSurvey,
  LoadAnswersBySurvey,
  LoadSurveys,
  CheckSurveyById,
} from '@/domain/usecases/survey';
import { faker } from '@faker-js/faker';
export class AddSurveySpy implements AddSurvey {
  Params?: AddSurvey.Params;

  async add(data: AddSurvey.Params): Promise<void> {
    this.Params = data;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveysModels();
  accountId?: string;

  async load(accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId;
    return this.result;
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.lorem.word(), faker.lorem.word()];
  id?: string;

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id;
    return this.result;
  }
}
export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true;
  id?: string;

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id;
    return this.result;
  }
}
