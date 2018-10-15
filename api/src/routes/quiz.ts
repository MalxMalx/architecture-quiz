import Router from 'koa-router';
import { Collection } from 'mongodb';
import { findOne, insertOne } from '../helpers/mongo';

const router = new Router({ prefix: '/api/v1' });

router.post('/start-quiz', async (ctx: any) => {
  // Start a quiz
  const { userId } = ctx.request.body;

  if (!userId) {
    return ctx.throw(400, 'userId required');
  }
  // check if userId exists
  const users: Collection = ctx.db.collection('users');

  const user = await findOne(users, { userId });

  if (!user) {
    return ctx.throw(404, 'user not found');
  }

  // create a user-quiz entry
  const userQuiz: Collection = ctx.db.collection('user-quiz');

  await insertOne(userQuiz, { userId, currentQuestionIndex: 0, score: 0 });

  // return the first question inside body
  const questions: Collection = ctx.db.collection('questions');
  const question = await findOne(questions, {});

  if (!question) {
    throw new Error('No questions!');
  }

  ctx.response.body = { question };
});

export default router;
