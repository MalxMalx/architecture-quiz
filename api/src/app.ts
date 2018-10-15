import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-body';
import path from 'path';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';
import historyFallback from 'koa2-history-api-fallback';

const app = new Koa();
const apiRouter = new Router({ prefix: '/api/v1' });

apiRouter.use(quiz.routes());
apiRouter.use(user.routes());
apiRouter.use(question.routes());

app.use(historyFallback());
app.use(serve(path.join(__dirname, '../../client/build')));
app.use(bodyParser());
app.use(apiRouter.routes());

export default app;
