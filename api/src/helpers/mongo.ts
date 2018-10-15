import { promisify } from 'util';
import { Collection } from 'mongodb';

export const findOne = (collection: Collection, ...args: any) =>
  promisify(collection.findOne).apply(collection, args);
export const insertOne = (collection: Collection, ...args: any) =>
  promisify(collection.insertOne).apply(collection, args);
