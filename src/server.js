import http from "http"
import WebSocket from "ws"
import express from "express"

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));


const handleListen = () => console.log(`Listening on http://localhost:3000`);

// express를 이용해 만든 http 서버
const server = http.createServr(app);
// http서버 위에 웹소켓 서버
const wss = new WebSocket.Server({ server })

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (message) => {
    console.log(message);
  });
  socket.send("hello!!!");
});

server.listen(3000, handleListen)
