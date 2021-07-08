import { Server, Socket } from 'socket.io';
import Player, { Vector2 } from './player';

const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io: Server = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const port = 42069;

app.use(cors());

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const getSocketRoomName = (socket) => {
  let it = socket.rooms.entries();
  it.next();
  return it.next().value?.[0];
};

const roomName = 'lobby';
const lobby = io.in(roomName);
const playerList: Player[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`a user(${socket.id}) connected to ${roomName}`);
  socket.join(roomName);

  socket.on('join', (player: Player) => {
    let existingPlayer = playerList.find((p) => p.socketId === socket.id);
    if (existingPlayer != null) {
      existingPlayer.position = player.position;
      existingPlayer.name = player.name;
      existingPlayer.dimensions = player.dimensions;
      existingPlayer.color = player.color;
    } else {
      let newPlayer = new Player(socket.id, player.name, player.position, player.dimensions, player.color);
      playerList.push(newPlayer);
    }

    io.to(socket.id).emit('setup_player', socket.id);

    lobby.emit('update', playerList);
  });

  socket.on('move', (player: Player) => {
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].socketId == player.socketId) {
        playerList[i] = player;
      }
    }

    lobby.emit('update', playerList);
  });

  socket.on('disconnect', (reason) => {
    let roomName = getSocketRoomName(socket);
    socket.leave(roomName);
    let leftPlayer = playerList.find((p) => p.socketId === socket.id);
    if (leftPlayer != null) {
      playerList.splice(playerList.indexOf(leftPlayer), 1);
    }
    console.log(`a user(${socket.id}) disconnected from ${roomName}: ${reason}`);
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
