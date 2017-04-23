import * as Koa from 'koa';
import * as Router from 'koa-router';

import { statusRoute } from './status/status';
import { conversationRoute } from './conversation/conversation';

export async function v1Route() {
  const router = Router();

  const routes = {
    status: await statusRoute(),
    conversation: await conversationRoute(),
  };

  router.use('/status',
    routes.status.routes(), routes.status.allowedMethods());
  router.use('/conversation',
    routes.conversation.routes(), routes.conversation.allowedMethods());

  const app = new Koa();

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
