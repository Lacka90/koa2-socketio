import * as Router from 'koa-router';
import { Conversation } from '../../../database/models/conversation';

export async function conversationRoute() {
  const router = Router();

  router.get('/', async (ctx) => {
    ctx.body = await Conversation.find({});
  });

  router.post('/', async (ctx) => {
    ctx.body = await new Conversation(ctx.request.body).save();
  });

  return router;
}
