import { MongoClient, Db } from 'mongodb';
import config from './config';

let db: Db;

async function initMongo() {
  const client = await MongoClient.connect(
    config.mongoUrl,
    { useNewUrlParser: true }
  );

  db = client.db(config.dbName);
}

export { initMongo, db };
