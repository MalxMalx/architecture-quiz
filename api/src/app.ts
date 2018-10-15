import Koa from 'koa';
import bodyParser from 'koa-body';
import quiz from './routes/quiz';
import user from './routes/user';
import question from './routes/question';

const app = new Koa();

app.use(bodyParser());
app.use(quiz.routes());
app.use(user.routes());
app.use(question.routes());

export default app;
