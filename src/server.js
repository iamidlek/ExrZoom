import http from "http";
// import WebSocket from "ws";
import { Server } from "SocketIo";
import { instrument } from "@socket.io/admin-ui"
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// express를 이용해 만든 http 서버
const httpServer = http.createServer(app);
// http서버 위에 웹소켓 서버
// const wss = new WebSocket.Server({ server });

// io
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


// function onSocketClose() {
//   console.log("Disconnected from the Browser ❌");
// }

// const sockets = [];

// wss.on("connection", (socket) => {
  //   sockets.push(socket);
  //   socket["nickname"] = "Anon";
  //   console.log("Connected to Browser ✅");
  //   socket.on("close", onSocketClose);
  //   socket.on("message", (msg) => {
    //     const message = JSON.parse(msg);
    //     switch (message.type) {
      //       case "new_message":
      //         sockets.forEach((aSocket) =>
      //           aSocket.send(`${socket.nickname}: ${message.payload}`)
      //         );
      //       case "nickname":
      //         socket["nickname"] = message.payload;
      //     }
      //   });
      // });
      
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpserver.listen(3000, handleListen);
      