import * as Router from 'koa-router';

export async function statusRoute() {
  const router = Router();

  router.get('/', async (ctx) => {
    ctx.body = { status: 'OK' }
  });

  return router;
}
