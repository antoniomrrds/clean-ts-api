import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/ports/db/survey';
import { SurveyModel } from '@/domain/entities';

import { AddSurveyModel } from '@/domain/usecases/survey';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveysWithId = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection<SurveyModel>(surveysWithId);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({
      _id: MongoHelper.objectId(id),
    });
    return MongoHelper.map<SurveyModel>(survey);
  }
}
