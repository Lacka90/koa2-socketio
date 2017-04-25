import * as Router from 'koa-router';
import { findAll, create } from '../../../dal/conversationDao/conversationDao';

export async function conversationRoute() {
  const router = Router();

  router.get('/', async (ctx) => {
    ctx.body = await findAll();
  });

  router.post('/', async (ctx) => {
    ctx.body = await create(ctx.request.body);
  });

  return router;
}
