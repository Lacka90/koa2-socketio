import * as _ from 'lodash';
import * as Koa from 'koa';
import * as Router from 'koa-router';

import { statusRoute } from './status/status';
import { authRoute } from './auth/auth';
import { userRoute } from './user/user';
import { roomRoute } from './room/room';

export async function v1Route() {
  const router = Router();

  const routes = {
    status: await statusRoute(),
    auth: await authRoute(),
    user: await userRoute(),
    room: await roomRoute(),
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
