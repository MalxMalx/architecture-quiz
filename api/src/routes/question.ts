import Router from 'koa-router';
import { Collection } from 'mongodb';
import uuidv4 from 'uuid';
import { get } from 'lodash';
import { insertOne } from '../helpers/mongo';

const router = new Router({ prefix: '/question' });

router.post('/', async (ctx: any) => {
  const image = get(ctx.request, 'files.image');
  const text = get(ctx.request, 'body.text');
  const answers = get(ctx.request, 'body.answers');
  const correctAnswers = get(ctx.request, 'body.correctAnswers');

  if (!image || !text || !answers || !correctAnswers) {
    return ctx.throw(400);
  }

  const questions: Collection = ctx.db.collection('questions');
  const id = uuidv4();

  await insertOne(questions, {
    _id: id,
    text,
    answers,
    correctAnswers
  });

  // TODO: store the image file

  ctx.status = 201;
  ctx.response.body = {
    id,
    text,
    answers,
    correctAnswers
  };
});

export default router;
