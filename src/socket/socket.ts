import * as Http from 'http';
import * as socket from 'socket.io';

export function socketInit(app): Http.Server {
  const server: Http.Server = Http.createServer(app.callback());
  const io = socket(server)

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('news', 'asd');
    io.emit('new', 'aaaaaaa')
  });

  return server;
}
