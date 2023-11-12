import { SaveSurveyResultRepository } from '@/application/ports/db/survey-result';
import { SurveyResultModel } from '@/domain/entities';
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection =
      await MongoHelper.getCollection('surveyResults');
    const res = await surveyResultCollection?.findOneAndUpdate(
      {
        surveyId: surveyData.surveyId,
        accountId: surveyData.accountId,
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
    return MongoHelper.map(res.value);
  }
}
