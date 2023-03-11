import type { Server, Socket } from 'socket.io'

class SocketIo {
  constructor (private readonly server: Server) {}

  public async connection (): Promise<Socket> {
    const socket = await new Promise<Socket>((resolve) =>
      this.server.on('connection', (socket) => resolve(socket))
    )

    return socket
  }

  public emit (ev: string, data: any): void {
    this.server.emit(ev, data)
  }

  public async listem (socket: Socket, ev: string): Promise<any> {
    const msg = await new Promise((resolve) =>
      socket.on(ev, (data) => resolve(data))
    )

    return msg
  }
}

export default SocketIo
