/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AddSurveyController } from '@/presentation/controllers/survey/add-survey';
import {
  AddSurvey,
  AddSurveyModel,
  HttpRequest,
  Validation,
} from '@/presentation/controllers/survey/add-survey/ports';
import {
  badRequest,
  noContent,
  serverError,
} from '@/presentation/helpers/http';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
});

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }

  return new ValidationStub();
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new AddSurveyStub();
};

type ValidationStubType = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const makeSut = (): ValidationStubType => {
  const addSurveyStub = makeAddSurvey();
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return { sut, validationStub, addSurveyStub };
};

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error('any_error')));
  });

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();

    const httpRequest = makeFakeRequest();

    const addSpy = jest.spyOn(addSurveyStub, 'add');

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();

    jest
      .spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 204 on success', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
