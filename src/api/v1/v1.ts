import * as Koa from 'koa';
import * as Router from 'koa-router';

import { statusRoute } from './status/status';
import { conversationRoute } from './conversation/conversation';
import { messageRoute } from './message/message';
import { authRoute } from './auth/auth';

export async function v1Route() {
  const router = Router();

  const routes = {
    status: await statusRoute(),
    conversation: await conversationRoute(),
    message: await messageRoute(),
    auth: await authRoute(),
  };
  
  router.use('/status',
    routes.status.routes(), routes.status.allowedMethods());
  router.use('/conversation',
    routes.conversation.routes(), routes.conversation.allowedMethods());
  router.use('/message',
    routes.message.routes(), routes.message.allowedMethods());
  router.use('/auth',
    routes.auth.routes(), routes.auth.allowedMethods());

  const app = new Koa();

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
