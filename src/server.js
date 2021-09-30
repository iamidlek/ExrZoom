import http from "http";
// import WebSocket from "ws";
import SocketIo from "SocketIo";
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
const wsServer = SocketIo(server);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done(); // 호출한 것은 front 쪽에서 실행됨
    }, 10000);
  });
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
      