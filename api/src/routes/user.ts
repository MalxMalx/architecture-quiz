import Router, { IRouterContext } from 'koa-router';
import uuidv4 from 'uuid';
import { Collection } from 'mongodb';
import { db } from '../db';

const router = new Router({ prefix: '/api/v1/user' });

router.post('/', async (ctx: IRouterContext) => {
  const { username } = ctx.request.body;

  if (!username) {
    return ctx.throw(400, 'username required');
  }

  const users: Collection = db.collection('users');

  if (await users.findOne({ username })) {
    return ctx.throw(400, 'username is already taken');
  }

  const userId = uuidv4();

  await users.insertOne({ _id: userId, username });

  ctx.response.body = {
    username: username,
    id: userId
  };
});

export default router;
