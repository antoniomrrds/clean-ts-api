import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from '@/application/ports/db';
import { AccountModel } from '@/domain/entities';
import { AddAccountModel } from '@/domain/usecases';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection?.insertOne(accountData);

    const accountDocument = await accountCollection?.findOne({
      _id: result?.insertedId,
    });
    return MongoHelper.map(accountDocument);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection?.findOne({ email });
    return MongoHelper.map(account);
  }
}
