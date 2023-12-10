import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/ports';
import { MongoHelper, QueryBuilder } from '@/infrastructure/db';
export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    CheckSurveyByIdRepository,
    LoadAnswersBySurveyRepository
{
  async add(surveyData: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        didAnswer: {
          $eq: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', MongoHelper.objectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
        date: 1,
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({
      _id: MongoHelper.objectId(id),
    });
    return survey && MongoHelper.map(survey);
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .match({
        _id: MongoHelper.objectId(id),
      })
      .project({
        _id: 0,
        answers: '$answers.answer',
      })
      .build();
    const surveys = await surveyCollection.aggregate(query).toArray();
    return surveys[0]?.answers || [];
  }

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne(
      {
        _id: MongoHelper.objectId(id),
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    return survey !== null;
  }
}
