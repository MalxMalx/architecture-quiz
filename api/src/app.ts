import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';

const app = new Koa();
const router = new Router({ prefix: '/api/v1' });

router.use(quiz.routes());
router.use(user.routes());
router.use(question.routes());

app.use(bodyParser());
app.use(router.routes());

export default app;
