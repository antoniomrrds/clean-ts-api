export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswerModel[];
};
export type SurveyAnswerModel = {
  image: string;
  answer: string;
};

export interface AddSurvey {
  add(surveyData: AddSurveyModel): Promise<void>;
}
