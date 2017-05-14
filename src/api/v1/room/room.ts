import * as Boom from 'boom';
import * as Router from 'koa-router';
import { RoomService } from './../../../services/room/roomService';
import { sendMessage } from '../../../socket/socket';

export async function roomRoute() {
  const router = Router();

  router.post('/room/offer', async (ctx) => {
    const userId = ctx.request.body['userId'];
    const connection = ctx.request.body['connection'];
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.createRoom(userId, connection);
    ctx.body = { room };
  });

  router.put('/room/answer', async (ctx) => {
    const userId = ctx.request.body['userId'];
    const connection = ctx.request.body['connection'];
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    await roomService.connectRoom(userId, connection);
    const room = await roomService.getRoom(userId);
    await sendMessage(userId, 'userCalling', room);
    ctx.body = { room };
  });

  router.get('/room/:userId', async (ctx) => {
    const userId = ctx.params.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.getRoom(userId);
    ctx.body = { room };
  });

  router.get('/room', async (ctx) => {
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.getRoom(userId);
    ctx.body = { room };
  });

  return router;
}
