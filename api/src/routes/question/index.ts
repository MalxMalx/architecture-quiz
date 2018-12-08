import Router from 'koa-router';
import handleCreate from './create/handler';
import handleGetAll from './get-all/handler';

const router = new Router({ prefix: '/api/v1/question' });

router.post('/', handleCreate);
router.get('/', handleGetAll);

export default router;
