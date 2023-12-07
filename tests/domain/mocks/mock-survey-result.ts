import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';
import { faker } from '@faker-js/faker';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.string.uuid(),
  accountId: faker.string.uuid(),
  answer: faker.lorem.word(),
  date: faker.date.recent(),
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.lorem.words(),
  answers: [
    {
      answer: faker.lorem.word(),
      image: faker.internet.avatar(),
      count: faker.number.int({ min: 0, max: 100 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
    {
      answer: faker.lorem.word(),
      image: faker.internet.avatar(),
      count: faker.number.int({ min: 0, max: 100 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
  ],
  date: faker.date.recent(),
});
export const mockSurveyResultEmpty = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.lorem.words(),
  answers: [
    {
      answer: faker.lorem.word(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
    {
      answer: faker.lorem.word(),
      image: faker.internet.avatar(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: faker.date.recent(),
});
