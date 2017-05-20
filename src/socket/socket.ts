import { UserService } from '@core/services/user/userService';
import * as Http from 'http';

let io = null;

export function socketInit(app): Http.Server {
  const server = Http.createServer(app.callback());
  io = require('socket.io')(server);

  io.use(async (socket, next) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      const userService = UserService.getInstance();
      await userService.updateSocketId(userId, socket.id);
        return next();
    }

    next(new Error('Authentication error'));
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', async (data) => {
      const userService = UserService.getInstance();
      const user = await userService.getBySocketId(socket.id);
      await userService.updateSocketId(user.id, null);

      io.emit('userDisconnected', { userId: user.id });
    });
  });

  return server;
}

export async function sendMessage(userId: string, subject: string, message: any) {
  const userService = UserService.getInstance();
  const user = await userService.getById(userId);

  console.log(user);
  if (user.socketId) {
    const sockets = io.sockets.connected;
    const socket = sockets[user.socketId];
    console.log(socket);
    if (socket) {
      socket.emit(subject, message);
    }
  }
}
