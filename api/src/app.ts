import Koa from 'koa';
import path from 'path';
import bodyParser from 'koa-body';
import serve from 'koa-static';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';

const app = new Koa();

app.use(bodyParser());
app.use(quiz.routes());
app.use(user.routes());
app.use(question.routes());
app.use(serve(path.join(__dirname, '../../client/build')));

export default app;
