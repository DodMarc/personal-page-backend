import { FastifyInstance } from "fastify";
import { Server } from "http";

export const initWebsocket = (server: FastifyInstance<Server>) => {

    server.io.on('connection', async (socket) => {
       await socket.join(socket.handshake.auth.type)

       socket.on('test', async (data) => {
            console.log(data)
       })
    })
}

