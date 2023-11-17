/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwError } from '@/domain/test';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey';
import {
  AddSurvey,
  HttpRequest,
  Validation,
} from '@/presentation/controllers/survey/add-survey/ports';
import {
  badRequest,
  noContent,
  serverError,
} from '@/presentation/helpers/http';
import { mockAddSurvey } from '@/presentation/test';
import { mockValidation } from '@/validation/test';

import MockDate from 'mockdate';

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
});

type sutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const makeSut = (): sutTypes => {
  const addSurveyStub = mockAddSurvey();
  const validationStub = mockValidation();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return { sut, validationStub, addSurveyStub };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new Error('any_error'));

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error('any_error')));
  });

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();

    const httpRequest = mockRequest();

    const addSpy = jest.spyOn(addSurveyStub, 'add');

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);
    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
  it('Should return 204 on success', async () => {
    const { sut } = makeSut();

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(noContent());
  });
});
