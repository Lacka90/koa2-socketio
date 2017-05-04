import * as Boom from 'boom';
import * as Router from 'koa-router';
import { UserService } from './../../../services/user/userService';

export async function userRoute() {
  const router = Router();

  router.get('/available', async (ctx) => {
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const users = await userService.availableUsers(userId);
    ctx.body = { users };
  });

  router.post('/room/offer', async (ctx) => {
    const userId = ctx.userId;
    const connection = ctx.request.body['connection'];
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const room = await userService.createRoom(userId, connection);
    ctx.body = { room };
  });

  router.put('/room/answer', async (ctx) => {
    const userId = ctx.userId;
    const connection = ctx.request.body['connection'];
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const room = await userService.connectRoom(userId, connection);
    ctx.body = { room };
  });

  router.get('/room/:userId', async (ctx) => {
    const userId = ctx.params.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const room = await userService.getRoom(userId);
    ctx.body = { room };
  });

  router.get('/room', async (ctx) => {
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const room = await userService.getRoom(userId);
    ctx.body = { room };
  });

  return router;
}
