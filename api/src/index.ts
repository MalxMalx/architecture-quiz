import app from './app';
import { initMongo } from './db';

async function main() {
  const port = process.env.PORT || 3000;

  process.on('unhandledRejection', error => {
    console.log({ message: 'API unhandledRejection error', data: {}, error });
  });

  process.on('uncaughtException', error => {
    console.log({ message: 'API uncaughtException error', data: {}, error });
  });

  await initMongo();

  app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}

main();
