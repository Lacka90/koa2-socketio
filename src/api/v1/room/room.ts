import * as Boom from 'boom';
import * as Router from 'koa-router';
import { sendMessage } from '@core/socket/socket';
import { RoomService } from '@core/services/room/roomService';

export async function roomRoute() {
  const router = Router();

  router.post('/offer', async (ctx) => {
    const userId = ctx.request.body['userId'];
    const connection = ctx.request.body['connection'];
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.createRoom(userId, connection);
    ctx.body = { room };
  });

  router.post('/answer', async (ctx) => {
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

  router.get('/:userId', async (ctx) => {
    const userId = ctx.params.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.getRoom(userId);
    ctx.body = { room };
  });

  router.get('/', async (ctx) => {
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const roomService = RoomService.getInstance();
    const room = await roomService.getRoom(userId);
    if (!room) {
      throw Boom.notFound('Room not found');
    }
    ctx.body = { room };
  });

  return router;
}
