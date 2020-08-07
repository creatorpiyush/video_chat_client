const express = require("express");

const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { v4: uuidV4 } = require("uuid");

const port = process.env.PORT || 5555;

app.set("view engine", "hbs");

app.use("/", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render(`room`, { roomId: req.params.room });
});

io.on(`connection`, (socket) => {
  // console.log(`connection:`, socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit(`user-connected`, userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
    // console.log(roomId, userId);
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
