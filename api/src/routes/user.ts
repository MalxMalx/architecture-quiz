import Router from 'koa-router';
import uuidv4 from 'uuid';
import { Collection } from 'mongodb';
import { findOne, insertOne } from '../helpers/mongo';

const router = new Router({ prefix: '/user' });

router.post('/', async (ctx: any) => {
  const { username } = ctx.request.body;

  if (!username) {
    return ctx.throw(400, 'username required');
  }

  const users: Collection = ctx.db.collection('users');

  if (await findOne(users, { username })) {
    return ctx.throw(400, 'username is already taken');
  }
  const userId = uuidv4();
  await insertOne(users, { _id: userId, username });

  ctx.response.body = {
    username: username,
    id: userId
  };
});

export default router;
