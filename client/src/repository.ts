import io, { Socket } from 'socket.io-client'

class Repository {
  private socket!: Socket

  private readonly uri: string = import.meta.env.VITE_SERVER_URL

  public createConnection(fileName: string) {
    this.socket = io(this.uri, {
      query: {
        fileName
      }
    })
  }

  public emitToServer(data: any) {
    this.socket.emit('upload', data)
  }

  public disconnect() {
    this.socket.disconnect()
  }
}

export default Repository
