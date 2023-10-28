/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AddSurveyController } from '@/presentation/controllers/survey/add-survey';
import {
  HttpRequest,
  Validation,
} from '@/presentation/controllers/survey/add-survey/ports';
import { badRequest } from '@/presentation/helpers/http';

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

type ValidationStubType = {
  sut: AddSurveyController;
  validationStub: Validation;
};

const makeSut = (): ValidationStubType => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);

  return { sut, validationStub };
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
});
