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

function handleConnection(socket) {
  console.log(socket);
}
wss.on("connection", handleConnection);

server.listen(3000, handleListen)
