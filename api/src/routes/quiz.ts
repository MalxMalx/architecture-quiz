import Router, { IRouterContext } from 'koa-router';
import { Collection } from 'mongodb';
import { db } from '../db';

const router = new Router({ prefix: '/api/v1/quiz' });

router.post('/start', async (ctx: IRouterContext) => {
  // Start a quiz
  const { userId } = ctx.request.body;

  if (!userId) {
    return ctx.throw(400, 'userId required');
  }
  // check if userId exists
  const users: Collection = db.collection('users');

  const user = await users.findOne({ userId });

  if (!user) {
    return ctx.throw(404, 'user not found');
  }

  // create a user-quiz entry
  const userQuizzes: Collection = db.collection('user-quiz');

  await userQuizzes.insertOne({ userId, currentQuestionIndex: 0, score: 0 });

  // return the first question inside body
  const questions: Collection = db.collection('questions');
  const question = await questions.findOne({});

  if (!question) {
    throw new Error('No questions!');
  }

  ctx.response.body = { question };
});

export default router;
