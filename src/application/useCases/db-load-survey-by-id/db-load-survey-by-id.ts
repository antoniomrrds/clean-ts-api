/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadSurveyByIdRepository } from '@/application/ports/db/survey';
import { SurveyModel } from '@/domain/entities';
import { LoadSurveyById } from '@/domain/usecases';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey;
  }
}
