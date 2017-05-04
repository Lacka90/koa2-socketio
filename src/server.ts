import * as path from 'path';
import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as Router from 'koa-router';
import * as helmet from 'koa-helmet';
import * as serve from 'koa-static-server';
import * as bodyParser from 'koa-bodyparser';
import { config } from './config';

import { jwtMiddleware } from './middlewares/jwtMiddleware';

import { api } from './api/api';
import { socketInit } from './socket/socket';

export async function start() {
  const app = new Koa();
  app.use(bodyParser());

  app.use(serve({rootDir: 'src/client', rootPath: '/web'}))

  app.use(helmet())

  app.use(jwtMiddleware({ secret: config.token.secret }))

  app.use(mount('/api', await api()))

  const server = socketInit(app);

  server.listen(3000);
}
