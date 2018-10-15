import Router from 'koa-router';
import { Collection } from 'mongodb';
import uuidv4 from 'uuid';
import { insertOne } from '../helpers/mongo';

const router = new Router();

router.post('/', async (ctx: any) => {
  const { text, answers, correctAnswers } = ctx.request.body;

  if (!text || !answers || !correctAnswers) {
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

  ctx.status = 201;
  ctx.response.body = {
    id,
    text,
    answers,
    correctAnswers
  };
});

export default router;
