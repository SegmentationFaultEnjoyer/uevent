require("dotenv").config();

// { sock: Socket, id: userID }


const http = require('http');
const { Server } = require("socket.io");

const PORT = process.env.PORT ?? 8080;
const HOST = process.env.HOST ?? 'localhost';
const URL = `http://${HOST}:${PORT}`
const CLIENT_URL = `http://${HOST}:${process.env.CLIENT_PORT ?? 3000}`

const { sendNotificationToClient, addOnlineUser, removeOnlineUser } = require('./helpers/socketNotificator')

const cors = require('cors')
const express = require('express');
const cookieParser = require("cookie-parser");

const router = require('./routers/router');

const app = express();
const server = http.createServer(app);
const socket = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"]
    }
})

socket.on('connection', sock => {
    addOnlineUser({
        sock,
        address: sock.handshake.auth.address
    })

    sock.on('disconnect', () => {
        removeOnlineUser(sock.handshake.auth.address)
    })
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin : CLIENT_URL,
    credentials: true
}))
app.use(router);

exports.runService = function () {
    server.listen(PORT, HOST, () => console.log(URL));
}

exports.server = app;