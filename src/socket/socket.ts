import { UserService } from './../services/user/userService';
import * as Http from 'http';

import * as Socket from 'koa-socket';

const sockets = {};

export function socketInit(app) {
  const io = new Socket()
  io.attach( app )

  io.on('connection', (ctx, data) => {
    sockets[ctx.socket.id] = ctx.socket;

    ctx.socket.on('disconnect', async (data) => {
      const userService = UserService.getInstance();
      const user = await userService.getBySocketId(ctx.socket.id);
      await userService.updateSocketId(user._id, null);
      delete sockets[ctx.socket.id];

      io.broadcast('userDisconnected', { userId: user._id });
    });

    ctx.socket.on('socketChange', async (data) => {
      const userService = UserService.getInstance();
      await userService.updateSocketId(data.userId, ctx.socket.id);

      const user = await userService.getById(data.userId);
      io.broadcast('userConnected', { user });
    });
  });
}

export async function sendMessage(userId: string, subject: string, message: string) {
  const userService = UserService.getInstance();
  const user = await userService.getById(userId);

  sockets[user.socketId].emit(subject, message);
}
