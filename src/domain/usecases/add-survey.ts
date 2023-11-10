import { SurveyAnswerModel } from '@/domain/entities';

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};

export interface AddSurvey {
  add(surveyData: AddSurveyModel): Promise<void>;
}
