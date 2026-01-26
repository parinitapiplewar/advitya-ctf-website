import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const GLOBAL_IO_KEY = "__CTF_SOCKET_IO__";
const GLOBAL_IO_INITED = "__CTF_SOCKET_IO_INITED__";

export function initSocket(server) {
  // If io exists AND listeners are already attached, return it
  if (global[GLOBAL_IO_KEY] && global[GLOBAL_IO_INITED]) {
    return global[GLOBAL_IO_KEY];
  }

  let io = global[GLOBAL_IO_KEY];

  if (!io) {
    io = new Server(server, {
      path: "/socket.io",
    });
    global[GLOBAL_IO_KEY] = io;
  }

  // 🧠 Attach listeners ONLY ONCE
  if (!global[GLOBAL_IO_INITED]) {
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Auth required"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = {
          id: decoded.userId,
          role: decoded.role,
          name: decoded.name,
          team: decoded.team,
        };

        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });

    io.on("connection", (socket) => {
      const { id, role, name, team } = socket.user;

      console.log(`🟢 socket connected | ${name} (${role})`);

      socket.join("global");
      socket.join(`user:${id}`);

      if (team) socket.join(`team:${team}`);
      if (role === "sudo") socket.join("admins");

      socket.once("disconnect", () => {
        // no-op, ensures listener doesn’t stack
        console.log(`🔴 socket disconnected | ${name}`);
      });
    });

    // Cleanup on process exit
    const cleanup = () => {
      io.removeAllListeners();
      io.close();
      global[GLOBAL_IO_KEY] = null;
      global[GLOBAL_IO_INITED] = false;
    };

    process.once("SIGTERM", cleanup);
    process.once("SIGINT", cleanup);

    global[GLOBAL_IO_INITED] = true;
  }

  return io;
}

/* =====================
   BROADCAST HELPERS
   ===================== */

export function broadcast(event) {
  global[GLOBAL_IO_KEY]?.to("global").emit("event", event);
}

export function broadcastToTeam(teamId, event) {
  global[GLOBAL_IO_KEY]?.to(`team:${teamId}`).emit("event", event);
}

export function broadcastToAdmins(event) {
  global[GLOBAL_IO_KEY]?.to("admins").emit("event", event);
}

export function broadcastToUser(userId, event) {
  global[GLOBAL_IO_KEY]?.to(`user:${userId}`).emit("event", event);
}
