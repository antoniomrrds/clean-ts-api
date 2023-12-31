import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/ports';
import { SurveyResultModel } from '@/domain/entities';
import { MongoHelper, QueryBuilder } from '@/infrastructure/db';

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
  async save(surveyData: SaveSurveyResultRepository.Params): Promise<void> {
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
  }

  async loadBySurveyId(
    surveyId: string,
    accountId: string,
  ): Promise<LoadSurveyResultRepository.Result> {
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
        total: {
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
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: {
              if: {
                $eq: ['$data.accountId', MongoHelper.objectId(accountId)],
              },
              then: '$data.answer',
              else: '$nope',
            },
          },
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                  isCurrentAccountAnswer: {
                    $cond: {
                      if: {
                        $eq: [
                          '$$item.answer',
                          {
                            $arrayElemAt: ['$currentAccountAnswer', 0],
                          },
                        ],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: {
            $round: ['$count'],
          },
          percent: { $round: ['$percent'] },
          isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer',
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer',
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
      .aggregate<SurveyResultModel>(query)
      .toArray();
    return surveyResult?.length ? surveyResult[0] : null;
  }
}
