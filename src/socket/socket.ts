import { UserService } from '@core/services/user/userService';
import { RoomService } from '@core/services/room/roomService';
import * as Boom from 'boom';
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
    socket.on('disconnect', async () => {
      const userService = UserService.getInstance();
      const user = await userService.getBySocketId(socket.id);
      await userService.updateSocketId(user.id, null);

      io.emit('userDisconnected', { userId: user.id });
    });

    socket.on('offerCall', async (data) => {
      const userId = data.userId;
      const connection = data.connection;

      if (!userId) {
        throw Boom.notFound('UserId not found');
      }

      const roomService = RoomService.getInstance();
      await roomService.createRoom(userId, connection);
    });

    socket.on('answerCall', async (data) => {
      const userId = data.userId;
      const connection = data.connection;

      if (!userId) {
        throw Boom.notFound('UserId not found');
      }

      const roomService = RoomService.getInstance();
      await roomService.connectRoom(userId, connection);
      const room = await roomService.getRoom(userId);
      await sendMessage(userId, 'userCalling', room);
    });

    socket.on('error', function (err) {
      console.log(err);
      if (err.description) throw err.description;
      else throw err; // Or whatever you want to do
    });
  });

  return server;
}

export async function sendMessage(userId: string, subject: string, message: any) {
  const userService = UserService.getInstance();
  const user = await userService.getById(userId);

  if (user.socketId) {
    const sockets = io.sockets.connected;
    const socket = sockets[user.socketId];
    if (socket) {
      socket.emit(subject, message);
    }
  }
}
