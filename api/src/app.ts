import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';

const app = new Koa();
const router = new Router({ prefix: '/api/v1' });

router.all('/quiz', quiz.routes());
router.all('/user', user.routes());
router.all('/question', question.routes());

app.use(bodyParser());
app.use(router.routes());

export default app;
