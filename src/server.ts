import * as path from 'path';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as Router from 'koa-router';
import * as helmet from 'koa-helmet';
import * as serve from 'koa-static-server';
import * as bodyParser from 'koa-bodyparser';
import { error } from 'koa-2-error-handler';
import { config } from './config';

import { jwtMiddleware } from './middlewares/jwtMiddleware';

import { api } from './api/api';
import { socketInit } from './socket/socket';

export async function start() {
  const app = new Koa();

  app.use(error((err, ctx) => {
    ctx.status = err.output.statusCode;
    ctx.body = err.output.payload;
  }));

  app.use(bodyParser());

  const webPath = path.join(__dirname, '../www');

  app.use(serve({rootDir: webPath, rootPath: ''}));

  app.use(helmet());

  app.use(jwtMiddleware({ secret: config.jwt.secret }));

  app.use(mount('/api', await api()));

  const server = socketInit(app);

  server.listen(config.port, config.host);
}
