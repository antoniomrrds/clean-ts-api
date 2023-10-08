import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '@/application/ports/db';
import { AccountModel } from '@/domain/entities';
import { AddAccountModel } from '@/domain/usecases';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { ObjectId } from 'mongodb';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection?.insertOne(accountData);

    const accountDocument = await accountCollection?.findOne({
      _id: result?.insertedId,
    });
    return MongoHelper.map(accountDocument);
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection?.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const objectId = new ObjectId(id);

    await accountCollection.updateOne(
      {
        _id: objectId,
      },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}
