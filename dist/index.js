"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = __importDefault(require("./player"));
var cors = require('cors');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
var port = 42069;
app.use(cors());
server.listen(port, function () {
    console.log("listening on *:" + port);
});
var getSocketRoomName = function (socket) {
    var _a;
    var it = socket.rooms.entries();
    it.next();
    return (_a = it.next().value) === null || _a === void 0 ? void 0 : _a[0];
};
var roomName = 'lobby';
var lobby = io.in(roomName);
var playerList = [];
io.on('connection', function (socket) {
    console.log("a user(" + socket.id + ") connected to " + roomName);
    socket.join(roomName);
    socket.on('join', function (player) {
        var existingPlayer = playerList.find(function (p) { return p.socketId === socket.id; });
        if (existingPlayer != null) {
            existingPlayer.position = player.position;
            existingPlayer.name = player.name;
            existingPlayer.dimensions = player.dimensions;
            existingPlayer.color = player.color;
        }
        else {
            var newPlayer = new player_1.default(socket.id, player.name, player.position, player.dimensions, player.color);
            playerList.push(newPlayer);
        }
        io.to(socket.id).emit('setup_player', socket.id);
        lobby.emit('update', playerList);
    });
    socket.on('move', function (player) {
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].socketId == player.socketId) {
                playerList[i] = player;
            }
        }
        lobby.emit('update', playerList);
    });
    socket.on('disconnect', function (reason) {
        var roomName = getSocketRoomName(socket);
        socket.leave(roomName);
        var leftPlayer = playerList.find(function (p) { return p.socketId === socket.id; });
        if (leftPlayer != null) {
            playerList.splice(playerList.indexOf(leftPlayer), 1);
        }
        console.log("a user(" + socket.id + ") disconnected from " + roomName + ": " + reason);
    });
});
// React Hook
// function useSocket(url, query?) {
//   const [socket, setSocket] = useState(null);
//   useEffect(() => {
//     const socketIo = io(url, { query });
//     setSocket(socketIo);
//     function cleanup() {
//       socketIo.disconnect();
//     }
//     return cleanup;
//   }, []);
//   return socket;
// }
