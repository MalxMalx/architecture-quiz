import Koa from 'koa';
import serve from 'koa-static';
import bodyParser from 'koa-body';
import path from 'path';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';
import historyFallback from 'koa2-history-api-fallback';

const app = new Koa();

app.use(historyFallback());
app.use(bodyParser());
app.use(serve(path.join(__dirname, '../../client/build')));
app.use(bodyParser({ multipart: false }));
app.use(quiz.routes());
app.use(user.routes());
app.use(question.routes());

export default app;
