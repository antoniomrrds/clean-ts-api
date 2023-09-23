import { AddAccountRepository } from '@/application/ports';
import { AccountModel } from '@/domain/entities';
import { AddAccountModel } from '@/domain/usecases';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection?.insertOne(accountData);

    const accountDocument = await accountCollection?.findOne({
      _id: result?.insertedId,
    });

    const { _id, ...accountWithoutId } = accountDocument || {};
    return {
      ...accountWithoutId,
      id: String(_id),
    } as AccountModel;
  }
}
