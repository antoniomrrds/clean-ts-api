import { SurveyModel } from '@/domain/entities';
import { AddSurveyParams } from '@/domain/usecases/survey';
import { faker } from '@faker-js/faker';

export const mockSurveyParams = (): AddSurveyParams => ({
  question: faker.lorem.words(),
  answers: [
    {
      answer: faker.lorem.word(),
      image: faker.internet.avatar(),
    },
    {
      answer: faker.lorem.word(),
    },
  ],
  date: faker.date.recent(),
});
export const mockSurveyModel = (): SurveyModel =>
  Object.assign({}, mockSurveyParams(), {
    id: faker.string.uuid(),
  });

export const mockSurveysModels = (): SurveyModel[] => {
  return [
    {
      id: faker.string.uuid(),
      question: faker.lorem.words(),
      answers: [
        {
          answer: faker.lorem.word(),
          image: faker.internet.avatar(),
        },
      ],
      date: faker.date.recent(),
    },
    {
      id: faker.string.uuid(),
      question: faker.lorem.words(),
      answers: [
        {
          answer: faker.lorem.word(),
          image: faker.internet.avatar(),
        },
      ],
      date: faker.date.recent(),
    },
  ];
};
