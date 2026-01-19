import http from "http";
import next from "next";
import { initSocket } from "./src/lib/socket.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("Next + Socket.IO Server started on 3000");
  });
});
