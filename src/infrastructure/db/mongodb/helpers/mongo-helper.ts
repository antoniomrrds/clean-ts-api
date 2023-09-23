/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
  },
  getCollection(name: string): Collection {
    return this.client?.db()?.collection(name) as Collection;
  },
  map<T>(data: any): T {
    const { _id, ...dataWithoutId } = data;
    return {
      ...dataWithoutId,
      id: String(_id),
    } as T;
  },
};
