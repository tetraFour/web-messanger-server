import { Socket } from 'socket.io';
import { date } from '~/utils/getDate.utils';

export class SocketUtils {
  constructor(private io: Socket, private readonly port: number) {
    this.io = io;
    this.port = port;
    console.log(
      `SOCKET.IO: Connected client on port ${this.port} at ${date()}`,
    );
  }

  public sendMessage = (data: any) => {
    console.log(data);
  };
  public disconnect = () => {
    console.log(`SOCKET.IO: Client disconnected at ${date()}`);
  };
}
