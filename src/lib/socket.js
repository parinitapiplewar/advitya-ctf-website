import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const GLOBAL_IO_KEY = "__CTF_SOCKET_IO__";

export function initSocket(server) {
  if (global[GLOBAL_IO_KEY]) {
    return global[GLOBAL_IO_KEY];
  }

  const io = new Server(server, {
    path: "/socket.io", // default, explicit for clarity
  });

  /* =====================
     AUTH MIDDLEWARE
     ===================== */
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
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  /* =====================
     CONNECTION
     ===================== */
  io.on("connection", (socket) => {
    const { id, role, name, team } = socket.user;

    console.log(`🟢 socket connected | ${name} (${role})`);

    // ---- rooms ----
    socket.join("global");
    socket.join(`user:${id}`);

    if (team) socket.join(`team:${team}`);
    if (role === "sudo") socket.join("admins");

    socket.on("disconnect", () => {
      console.log(`🔴 socket disconnected | ${name}`);
    });
  });

  global[GLOBAL_IO_KEY] = io;
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
