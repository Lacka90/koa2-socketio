import * as _ from 'lodash';
import * as Koa from 'koa';
import * as Router from 'koa-router';

import { statusRoute } from './status/status';
import { conversationRoute } from './conversation/conversation';
import { messageRoute } from './message/message';
import { authRoute } from './auth/auth';
import { userRoute } from './user/user';

export async function v1Route() {
  const router = Router();

  const routes = {
    status: await statusRoute(),
    conversation: await conversationRoute(),
    message: await messageRoute(),
    auth: await authRoute(),
    user: await userRoute(),
  };

  _.forOwn(routes, (value, key) => {
    router.use(
      `/${key}`,
      value.routes(),
      value.allowedMethods()
    );
  });
  
  const app = new Koa();

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
