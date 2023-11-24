import { SaveSurveyResultRepository } from '@/application/ports/db/survey-result';
import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { MongoHelper, QueryBuilder } from '@/infrastructure/db/mongodb/helpers';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection?.findOneAndUpdate(
      {
        surveyId: MongoHelper.objectId(surveyData.surveyId),
        accountId: MongoHelper.objectId(surveyData.accountId),
      },
      {
        $set: {
          answer: surveyData.answer,
          date: surveyData.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    const surveyResult = await this.loadBySurveyId(surveyData.surveyId);
    return surveyResult as SurveyResultModel;
  }

  private async loadBySurveyId(
    surveyId: string,
  ): Promise<SurveyResultModel | null> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults');
    const query = new QueryBuilder()
      .match({
        surveyId: MongoHelper.objectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer'],
              },
            },
          },
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$_id.answer',
      })

      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $cond: [
                {
                  $and: [{ $isNumber: '$count' }, { $isNumber: '$_id.total' }],
                },
                { $multiply: [{ $divide: ['$count', '$_id.total'] }, 100] },
                0,
              ],
            },
          ],
        },
      })

      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
        },
        answers: {
          $push: '$_id.answer',
        },
      })

      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyResultCollection
      .aggregate(query)
      .toArray();
    console.log(surveyResult[0]);
    return surveyResult?.length ? (surveyResult[0] as SurveyResultModel) : null;
  }
}
