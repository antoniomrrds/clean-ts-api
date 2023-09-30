/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient | null,
  uri: null as string | null,
  isConnected: false,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
    this.isConnected = true;
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
    this.isConnected = false;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this?.isConnected) {
      await this.connect(this.uri as string);
    }
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