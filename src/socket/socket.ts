import { UserService } from './../services/user/userService';
import * as Http from 'http';

import * as Socket from 'koa-socket';

const sockets = {};

export function socketInit(app) {
  const io = new Socket()
  io.attach( app )

  io.on('connection', (ctx, data) => {
    console.log('a user connected', data);
    sockets[ctx.socket.id] = ctx.socket;
    io.broadcast('news', { id: ctx.socket.id, userId: ctx.userId });
  });

  io.on('socketChange', async (ctx, data) => {
    const userService = UserService.getInstance();
    await userService.updateSocketId(data.userId, ctx.socket.id);
  });
}

export async function sendMessage(userId: string, subject: string, message: string) {
  const userService = UserService.getInstance();
  const user = await userService.getById(userId);

  sockets[user.socketId].emit(subject, message);
}
