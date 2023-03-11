import './config/env'
import HarddiskRepository from './repositories/HarddiskRepository'

import express from 'express'
import socketIO from 'socket.io'
import cors from 'cors'

import http from 'http'
import fs from 'fs'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL
}))

app.use(express.json())

app.get('/files', async (request, response) => {
  const harddiskRepository = new HarddiskRepository()

  const path = harddiskRepository.getUploadFilesPath()

  const filesInfo = await harddiskRepository.getFilesInformation(path)

  return response.status(200).json(filesInfo)
})

const webServer = http.createServer(app)
const io = new socketIO.Server(webServer, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: process.env.CLIENT_URL
  }
})

webServer.listen(3000, () => {
  console.log('⚡️[server] server on')
})

io.on('connection', (socket) => {
  const fileName = socket.handshake.query.fileName as string

  const writeStream = fs.createWriteStream(`upload/${fileName}`)

  socket.on("upload", (data: Buffer) => {
    writeStream.write(data)

    socket.on('end', () => writeStream.end())
  })
})
