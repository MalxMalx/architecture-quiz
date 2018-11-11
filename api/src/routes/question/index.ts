import Router from 'koa-router';
import handleCreate from './create/handler';

const router = new Router({ prefix: '/question' });

router.post('/', handleCreate);

export default router;
