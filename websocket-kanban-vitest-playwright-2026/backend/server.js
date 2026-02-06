const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let tasks = [];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("sync:tasks", tasks);

  socket.on("task:create", (task) => {
    tasks.push(task);
    io.emit("sync:tasks", tasks);
  });

  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    io.emit("sync:tasks", tasks);
  });

  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter((t) => t.id !== taskId);
    io.emit("sync:tasks", tasks);
  });

  socket.on("task:move", ({ id, column }) => {
    tasks = tasks.map((t) => (t.id === id ? { ...t, column } : t));
    io.emit("sync:tasks", tasks);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
