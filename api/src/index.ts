import { MongoClient } from 'mongodb';
import config from './config';
import app from './app';

MongoClient.connect(
  config.mongoUrl,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) throw err;
    const db = client.db(config.dbName);
    app.context = Object.create(app.context, { db: { value: db } });
    app.listen(3000, () => {
      console.log('listening on port ' + 3000); // eslint-disable-line no-console
    });
  }
);

process.on('unhandledRejection', error => {
  console.log({ message: 'API unhandledRejection error', data: {}, error });
});

process.on('uncaughtException', error => {
  console.log({ message: 'API uncaughtException error', data: {}, error });
});
