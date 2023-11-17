import {
  AddSurvey,
  AddSurveyParams,
  AddSurveyRepository,
} from '@/application/useCases/survey/add-survey/ports';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  async add(surveyData: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(surveyData);
  }
}
