const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("callUser", ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("chat", (msg) => {
    socket.broadcast.emit("chat", msg);
  });
});

server.listen(5000, () => console.log("Server running on 5000"));