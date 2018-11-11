import Router from 'koa-router';
import handleCreate from './create/handler';

const router = new Router({ prefix: '/api/v1/question' });

router.post('/', handleCreate);

export default router;
