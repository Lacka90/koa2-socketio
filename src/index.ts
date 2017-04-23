import * as Koa from 'koa';
const app = new Koa();

// x-response-time

app.use(async function (ctx, next) {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async function (ctx, next) {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`);
});

// response

app.use(ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);