import * as Router from 'koa-router';
import { Message } from '../../../database/models/message';

export async function messageRoute() {
  const router = Router();

  router.get('/', async (ctx) => {
    ctx.body = await Message.find({});
  });

  router.post('/', async (ctx) => {
    ctx.body = await new Message(ctx.request.body).save();
  });

  return router;
}
