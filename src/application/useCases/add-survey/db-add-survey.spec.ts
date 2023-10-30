/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbAddSurvey } from '@/application/useCases/add-survey/db-add-survey';
import {
  AddSurveyModel,
  AddSurveyRepository,
} from '@/application/useCases/add-survey/ports';
const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
});

describe('DbAddSurvey Usecase', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add(surveyData: AddSurveyModel): Promise<void> {
        return Promise.resolve();
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    await sut.add(makeFakeSurveyData());
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData());
  });
});
