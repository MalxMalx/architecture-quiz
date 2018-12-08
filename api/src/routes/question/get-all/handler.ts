import { IRouterContext } from 'koa-router';
import { getAllQuestionRecords } from '../get-all-question-records';

export default async function handleGetAll(ctx: IRouterContext) {
  console.log('get all questions API request received');

  try {
    const questions = await getAllQuestionRecords();

    ctx.body = { questions };
  } catch (error) {
    console.error(error);

    return ctx.throw(500, 'Internal Server Error');
  }
}
