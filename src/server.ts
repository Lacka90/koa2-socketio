import * as path from 'path';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as Router from 'koa-router';
import * as helmet from 'koa-helmet';
import * as serve from 'koa-static-server';
import * as bodyParser from 'koa-bodyparser';
import * as cors from 'koa2-cors';
import { config } from './config';

import { jwtMiddleware } from './middlewares/jwtMiddleware';

import { api } from './api/api';
import { socketInit } from './socket/socket';

export async function start() {
  const app = new Koa();
  app.use(cors());

  app.use(bodyParser());

  app.use(serve({rootDir: path.join(__dirname, '../www'), rootPath: ''}))

  app.use(helmet())

  app.use(jwtMiddleware({ secret: config.jwt.secret }))

  app.use(mount('/api', await api()))

  const server = socketInit(app);

  console.log('Server start at port: ' + config.port);

  server.listen(config.port);
}
