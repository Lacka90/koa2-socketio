import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as Router from 'koa-router';
import * as helmet from 'koa-helmet';
import * as bodyParser from 'koa-bodyparser';
import * as Http from 'http';
import * as socket from 'socket.io';

import { init } from './database';
import { api } from './api/api';

const app = new Koa();
app.use(bodyParser());

export async function start() {
  return await init().then(async () => {
    try {
      app.use(helmet())

      const routes = {
        api: await api(),
      }

      app.use(mount('/api', routes.api))
    } catch (err) {
      console.error(err);
    }

    const server:Http.Server = Http.createServer(app.callback());
    const io = socket(server)

    server.listen(3000);
  });
}
