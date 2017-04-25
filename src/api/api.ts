import * as Koa from 'koa';
import * as mount from 'koa-mount';

import { v1Route } from './v1/v1';

export async function api() {
  const app = new Koa();

  const routes = {
    v1: await v1Route(),
  };

  app.use(mount('/v1', routes.v1));

  return app;
}
