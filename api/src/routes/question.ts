import Router from 'koa-router';
import { Collection } from 'mongodb';
import uuidv4 from 'uuid';
import { get } from 'lodash';
import { insertOne } from '../helpers/mongo';
import S3 from 'aws-sdk/clients/s3';

const router = new Router({ prefix: '/question' });

router.post('/', async (ctx: any) => {
  const image = get(ctx.request, 'files.image');
  const text = get(ctx.request, 'body.text');
  const answersString = get(ctx.request, 'body.answers');
  const correctAnswersIndexesString = get(
    ctx.request,
    'body.correctAnswersIndexes'
  );

  if (!image || !text || !answersString || !correctAnswersIndexesString) {
    return ctx.throw(400);
  }

  // TODO: in answersString some chars can be escaped, i.e. \' instead of '
  const answers = answersString.split(',');
  const correctAnswersIndexes = correctAnswersIndexesString
    .split(',')
    .map(parseInt);

  // console.log(image);
  S3;

  const questions: Collection = ctx.db.collection('questions');
  const id = uuidv4();

  await insertOne(questions, {
    _id: id,
    text,
    answers,
    correctAnswersIndexes
  });

  // TODO: store the image file

  ctx.status = 201;
  ctx.response.body = {
    id,
    text,
    answers,
    correctAnswersIndexes
  };
});

export default router;
