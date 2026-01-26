import express from "express";
import http from "http";
import { Server } from "socket.io";
import pty from "node-pty";

const FLAG = process.env.FLAG;
if (!FLAG) {
  console.error("FLAG not set");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  const shell = pty.spawn("/bin/sh", ["./challenge.sh"], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
    env: {
      ...process.env,
      FLAG,
    },
  });

  shell.onData((data) => {
    socket.emit("output", data);
  });

  socket.on("input", (data) => {
    shell.write(data);
  });

  socket.on("disconnect", () => {
    shell.kill();
  });
});

server.listen(80, () => {
  console.log("CTF PTY challenge running on port 80");
});

