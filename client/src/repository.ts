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

  public emitToServer(ev: string, data?: any) {
    this.socket.emit(ev, data)
  }

  public listemFromServer(callback: (p: number) => void) {
    this.socket.on('bytesWritten', (bytesWritten: number) =>
      callback(bytesWritten)
    )
  }

  public disconnect() {
    this.socket.disconnect()
  }
}

export default Repository
