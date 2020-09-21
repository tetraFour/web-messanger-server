import express from 'express';
import mongoose from 'mongoose';
import server, { Server } from 'http';
import socket from 'socket.io';

import { SocketUtils } from '~/utils';

class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly server: Server;
  private io: socket.Server;

  constructor(appInit: { port: number; middlewares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;
    this.server = server.createServer(this.app);

    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
    this.assets();
    this.databaseConnection();
    this.initSocket();
  }

  private middlewares(middlewares: {
    forEach: (mw: (middleWare: any) => void) => void;
  }) {
    middlewares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (ctrl: (controller: any) => void) => void;
  }) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  private initSocket() {
    this.io = socket(this.server);
  }

  private async databaseConnection() {
    try {
      await mongoose.connect(<string>process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });

      console.log('MONGO_DB: SUCCESS');
    } catch (e) {
      console.error(e);
    }
  }

  private assets() {
    this.app.use(express.static('public'));
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`NODEJS: App listening on the http://localhost:${this.port}`);
    });
    this.io.on('connection', (socket: socket.Socket) => {
      console.log('SOCKET.IO: socketId = ', socket.id);
      const ws = new SocketUtils(socket, this.port);

      socket.on('message', () => ws.sendMessage('hello world from socket.io'));
      socket.on('disconnect', () => ws.disconnect());
    });
  }
}

export default App;
