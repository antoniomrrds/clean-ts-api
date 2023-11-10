export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};
export type SurveyAnswerModel = {
  image?: string;
  answer: string;
};

export interface AddSurvey {
  add(surveyData: AddSurveyModel): Promise<void>;
}
